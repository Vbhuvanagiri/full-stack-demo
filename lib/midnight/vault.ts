import { rawTokenType } from '@midnight-ntwrk/compact-runtime';
import {
  Contract as EthersContract,
  JsonRpcProvider,
  type Transaction,
} from 'ethers';
import {
  calculateRequestId,
  requestIdHex,
  requestIdBytes,
  deriveEvmAddress,
  evmAddressAbiWord,
  numericAbiWord,
  asciiPadded,
  hexToBytes,
  bytesToHex,
  stripHexPrefix,
  toSignBidirectionalEventIndex,
  deriveMidnightResponseKey,
  deserializeEvmOutput,
  serializeRespondOutput,
  signBidirectionalEventToSignedEvmTransaction,
  signetEventSourceFromPublicDataProvider,
  SignetRequestResponseReader,
  SIGNET_DEFAULT_KEY_VERSION,
  PATH_BYTES,
  MPC_PARAMS_BYTES,
  MPC_FAILURE_OUTPUT,
  MPCSignatureAlgorithm,
  MPCDestination,
  TxParamType,
  type RequestIdHex,
  type SignBidirectionalEvent,
} from '@sig-net/midnight';

import { flow } from './flow';
import {
  ERC20_TRANSFER_GAS_LIMIT as GAS_LIMIT,
  ERC20_TRANSFER_MAX_FEE_PER_GAS as MAX_FEE,
  ERC20_TRANSFER_MAX_PRIORITY_FEE_PER_GAS as PRIORITY_FEE,
} from './evm-envelope';
import {
  pureCircuits,
  ledger,
  VAULT_REQUESTS_INDEX_FIELD,
  VAULT_SWAP_REQUESTS_INDEX_FIELD,
} from './contract-exports';
import {
  APPROVE_SELECTOR,
  EXACT_OUTPUT_SINGLE_SELECTOR,
  MAX_APPROVE,
  SWAP_GAS_LIMIT,
  SWAP_MAX_FEE_PER_GAS,
  SWAP_MAX_PRIORITY_FEE_PER_GAS,
  SWAP_MPC_ROUTING,
  SWAP_OUTPUT_SCHEMA,
  SWAP_RESPOND_SCHEMA,
  UNISWAP_SWAP_ROUTER_02,
  quoteExactInputSingle,
  routerAllowance,
} from './evm-swap';

// Fixed EVM transfer envelope + MPC routing (mirrors the reference integration tests).
const ERC20_TRANSFER_SELECTOR = new Uint8Array([0xa9, 0x05, 0x9c, 0xbb]);
const RESULT_SCHEMA = '[{"name":"success","type":"bool"}]';
const VAULT_PATH = asciiPadded('vault', PATH_BYTES);
const MINUTE = 60_000;

const MPC_ROUTING = {
  algo: MPCSignatureAlgorithm.ecdsa,
  dest: MPCDestination.unused,
  params: new Uint8Array(MPC_PARAMS_BYTES),
  outputDeserializationSchema: asciiPadded(RESULT_SCHEMA, RESULT_SCHEMA.length),
  respondSerializationSchema: asciiPadded(RESULT_SCHEMA, RESULT_SCHEMA.length),
};

export type Env = {
  contractAddress: string; // Midnight vault contract
  signetContractAddress: string; // Midnight central signet contract
  mpcSecpPub: string; // MPC root secp256k1 pubkey (0x hex)
  evmRpcUrl: string; // Sepolia JSON-RPC
  fakenetResponsesUrl: string; // fakenet /responses cache
};

const addrBytes = (hex: string) => hexToBytes(stripHexPrefix(hex));
const rand32 = () => crypto.getRandomValues(new Uint8Array(32));
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export interface Identity {
  secretKey: Uint8Array;
  commitment: Uint8Array;
  pathString: string;
}

// deriveEvmAddress with the default midnight:testnet chainId — matches the responder.
// The path is the commitment bytes as UTF-8 with NULs stripped; MUST be TextDecoder, not
// Buffer (the browser polyfill emits different U+FFFD runs, desyncing the address).
export function deriveIdentity(secretKey: Uint8Array): Identity {
  const commitment = pureCircuits.userCommitment(secretKey);
  const pathString = new TextDecoder('utf-8')
    .decode(commitment)
    .replace(/\0/g, '');
  return { secretKey, commitment, pathString };
}
export function depositAddress(env: Env, identity: Identity): string {
  return deriveEvmAddress(
    env.mpcSecpPub,
    env.contractAddress,
    identity.pathString,
  );
}
export function vaultAddress(env: Env): string {
  return deriveEvmAddress(env.mpcSecpPub, env.contractAddress, 'vault');
}

// Shielded vault-token color for an ERC-20 under this vault.
export function vaultTokenType(
  erc20Hex: string,
  vaultContractAddress: string,
): string {
  const raw: any = rawTokenType(
    (pureCircuits as any).vaultTokenDomainSeparator(addrBytes(erc20Hex)),
    vaultContractAddress as any,
  );
  return (typeof raw === 'string' ? raw : bytesToHex(raw))
    .replace(/^0x/, '')
    .toLowerCase();
}

export async function erc20Balance(
  rpcUrl: string,
  erc20Hex: string,
  address: string,
): Promise<bigint> {
  const token = new EthersContract(
    erc20Hex,
    ['function balanceOf(address) view returns (uint256)'],
    new JsonRpcProvider(rpcUrl),
  );
  return BigInt(await token.getFunction('balanceOf')(address));
}

async function readVaultLedger(providers: any, env: Env): Promise<any> {
  const cs = await providers.publicDataProvider.queryContractState(
    env.contractAddress,
  );
  if (!cs) throw new Error(`no contract state at ${env.contractAddress}`);
  return (ledger as any)(cs.data);
}

function responseReader(
  providers: any,
  env: Env,
  indexField: number = VAULT_REQUESTS_INDEX_FIELD,
): SignetRequestResponseReader {
  return new SignetRequestResponseReader({
    requesterContractAddress: env.contractAddress,
    // 0.19: the reader locates the request by ledger-tree PATH, not a field index.
    // deposit/withdraw live at field 0 (path [0]), swaps at field 11 (path [11]).
    requesterRequestsPath: [indexField],
    signetContractAddress: env.signetContractAddress,
    publicDataProvider: providers.publicDataProvider,
    // 0.19: the MPC's responses are read from the signet contract's emitted
    // events, adapted from the same public data provider.
    eventSource: signetEventSourceFromPublicDataProvider(providers.publicDataProvider),
  } as any);
}

// Predict the request id the vault will record: the full request record, hashed.
function predictRequestId(
  env: Env,
  before: any,
  path: Uint8Array,
  nonce: bigint,
  erc20: Uint8Array,
  transferTo: Uint8Array,
  amount: bigint,
): RequestIdHex {
  const expected: SignBidirectionalEvent = {
    sender: { bytes: addrBytes(env.contractAddress) },
    requestNonce: before.signetRequestNonce,
    keyVersion: SIGNET_DEFAULT_KEY_VERSION,
    path,
    ...MPC_ROUTING,
    txParamType: TxParamType.evmType2,
    caip2Id: before.caip2Id,
    txParams: {
      to: erc20,
      chainId: before.evmChainId,
      nonce,
      gasLimit: GAS_LIMIT,
      maxFeePerGas: MAX_FEE,
      maxPriorityFeePerGas: PRIORITY_FEE,
      value: 0n,
      accessListEntryCount: 0n,
      accessList: [],
      calldata: {
        is_some: true,
        value: {
          selector: ERC20_TRANSFER_SELECTOR,
          noWords: 2n,
          words: [evmAddressAbiWord(transferTo), numericAbiWord(amount)],
        },
      },
    },
  } as any;
  return requestIdHex(calculateRequestId(expected)) as RequestIdHex;
}

async function assertRequestOnLedger(
  providers: any,
  env: Env,
  rid: RequestIdHex,
  circuit: string,
) {
  const after = await readVaultLedger(providers, env);
  if (
    !toSignBidirectionalEventIndex(after.signBidirectionalEventMap).has(rid)
  ) {
    throw new Error(`request ${rid} not on the ledger after ${circuit}()`);
  }
}

// Swaps register in swapEventMap (field 11), a separate map from the transfer map above.
async function assertSwapRequestOnLedger(
  providers: any,
  env: Env,
  rid: RequestIdHex,
) {
  const after = await readVaultLedger(providers, env);
  if (!toSignBidirectionalEventIndex(after.swapEventMap).has(rid)) {
    throw new Error(`swap request ${rid} not on the ledger after swap()`);
  }
}

// Predict the request id for any EVM call the vault records: the full request record hashed.
// Generalises predictRequestId over the calldata (selector + ABI words), the gas envelope
// and the MPC routing, so approve (2-word transfer schema) and swap (7-word amountOut
// schema) share one builder.
function predictCallRequestId(
  env: Env,
  before: any,
  path: Uint8Array,
  nonce: bigint,
  to: Uint8Array,
  routing: any,
  gasLimit: bigint,
  maxFee: bigint,
  priorityFee: bigint,
  selector: Uint8Array,
  words: Uint8Array[],
): RequestIdHex {
  const expected: SignBidirectionalEvent = {
    sender: { bytes: addrBytes(env.contractAddress) },
    requestNonce: before.signetRequestNonce,
    keyVersion: SIGNET_DEFAULT_KEY_VERSION,
    path,
    ...routing,
    txParamType: TxParamType.evmType2,
    caip2Id: before.caip2Id,
    txParams: {
      to,
      chainId: before.evmChainId,
      nonce,
      gasLimit,
      maxFeePerGas: maxFee,
      maxPriorityFeePerGas: priorityFee,
      value: 0n,
      accessListEntryCount: 0n,
      accessList: [],
      calldata: {
        is_some: true,
        value: { selector, noWords: BigInt(words.length), words },
      },
    },
  } as any;
  return requestIdHex(calculateRequestId(expected)) as RequestIdHex;
}

async function fetchFakenetResponse(
  env: Env,
  requestId: string,
  timeoutMs = 8000,
): Promise<any> {
  const url = `${env.fakenetResponsesUrl}/responses/${requestId}`;
  const deadline = Date.now() + timeoutMs;
  let last = 'not attempted';
  do {
    try {
      const r = await fetch(url);
      if (r.ok) return await r.json();
      last = `HTTP ${r.status}`;
    } catch (e) {
      last = `fetch failed: ${String(e)}`;
    }
    await sleep(1000);
  } while (Date.now() < deadline);
  throw new Error(`no fakenet response for ${requestId} (${last})`);
}

// Stage 1: poll the signet contract until the MPC's signature over the EVM tx appears.
async function pollSignatureResponse(
  providers: any,
  env: Env,
  requestId: RequestIdHex,
  expectedSigner: string,
  log: (m: string) => void,
  indexField: number = VAULT_REQUESTS_INDEX_FIELD,
  timeoutMs = 6 * MINUTE,
): Promise<Transaction> {
  const reader = responseReader(providers, env, indexField);
  const end = Date.now() + timeoutMs;
  const warned = new Set<bigint>();
  while (Date.now() < end) {
    const { verified, verdicts } =
      await reader.getVerifiedSignatureRespondedEvent(
        requestId,
        expectedSigner,
      );
    for (const v of verdicts as any[]) {
      if (v.rejectedReason !== undefined && !warned.has(v.count)) {
        warned.add(v.count);
        log(`ignoring response post ${v.count}: ${v.rejectedReason}`);
      }
    }
    if (verified !== undefined) {
      const request = await reader.getSignatureRequest(requestId);
      return signBidirectionalEventToSignedEvmTransaction(
        request,
        verified,
      ) as unknown as Transaction;
    }
    await sleep(1000);
  }
  throw new Error(`timed out waiting for signature response to ${requestId}`);
}

// Broadcast the MPC-signed EVM tx (idempotent across retries). In a settle flow a revert is a
// valid outcome — the MPC attests the failure and the caller refunds (swap/withdraw) or surfaces
// it (deposit) — so `throwOnRevert` is false there. Sign-only flows (router approval) have no
// attestation to fall back on, so a revert there is fatal.
//
// The signed tx is deterministic, so broadcasting is idempotent and retryable. A settle flow has
// already BURNED the surrendered coin, so a failed broadcast must not strand it: there is no
// failure attestation for a tx that never reached the chain (the MPC waits on-chain), so the only
// recovery is to land THIS tx. `ensureGas` re-runs the gas top-up between attempts, so an
// under-funded account ("insufficient funds") is refilled and the same signed tx re-broadcast.
async function broadcastEvm(
  env: Env,
  tx: Transaction,
  opts: { throwOnRevert?: boolean; ensureGas?: () => Promise<void> } = {},
): Promise<void> {
  const { throwOnRevert = true, ensureGas } = opts;
  const provider = new JsonRpcProvider(env.evmRpcUrl);
  const { hash } = tx;
  if (!hash) throw new Error('signed tx missing hash');
  const mined = await provider.getTransactionReceipt(hash);
  if (mined) {
    if (mined.status === 0 && throwOnRevert)
      throw new Error(`sweep ${hash} reverted`);
    return;
  }
  const MAX_ATTEMPTS = 5;
  for (let attempt = 1; ; attempt++) {
    try {
      await provider.broadcastTransaction(tx.serialized);
      break;
    } catch (e: any) {
      const msg = String(e?.message ?? '').toLowerCase();
      // Already in the mempool (or mined by a prior attempt) — proceed to await the receipt.
      if (
        e?.code === 'NONCE_EXPIRED' ||
        msg.includes('already known') ||
        msg.includes('nonce too low')
      )
        break;
      if (attempt >= MAX_ATTEMPTS) throw e;
      // Under-funded gas: refill and re-broadcast the same signed tx. Other transient RPC
      // failures: back off and retry.
      if (msg.includes('insufficient funds') && ensureGas) await ensureGas();
      await sleep(2000);
    }
  }
  const receipt = await provider.waitForTransaction(hash, 1, 3 * MINUTE);
  if (!receipt) throw new Error(`sweep ${hash} not confirmed`);
  if (receipt.status === 0 && throwOnRevert)
    throw new Error(`sweep ${hash} reverted`);
}

// Stage 2: match the MPC's attestation digest against the recomputed serialized output.
// The log is unauthenticated — the settle circuits re-verify digest + signature in-circuit.
async function fetchAttestedRespondOutcome(
  providers: any,
  env: Env,
  requestId: RequestIdHex,
  indexField: number = VAULT_REQUESTS_INDEX_FIELD,
  schema: string = RESULT_SCHEMA,
  respondSchema: string = schema,
): Promise<any | undefined> {
  const reader = responseReader(providers, env, indexField);
  // The MPC response key the vault pinned at deploy (sender-scoped: derived from
  // the MPC root pubkey + this vault's address). getVerifiedRespondBidirectionalEvent
  // authenticates each candidate's signature against it — the 0.19 event carries only
  // the signature, not a digest, so matching is by verifying, not by comparing digests.
  const mpcResponseKey = deriveMidnightResponseKey(
    env.mpcSecpPub,
    env.contractAddress,
  );
  let cached: any;
  try {
    cached = await fetchFakenetResponse(env, requestId);
  } catch {
    cached = undefined;
  }
  const candidates: { serializedOutput: Uint8Array; isFailure: boolean }[] = [];
  // The transfer schema decodes a bool; the swap OUTPUT schema a uint256 amountIn. The MPC
  // re-packs against `respondSchema` (equal to `schema` for the symmetric transfer case, but a
  // narrower uint64 for swap). decodedValue is what a success settle reads (the bool, or amountIn).
  let decodedValue: any;
  if (cached?.success && cached.output != null) {
    try {
      const decoded: any = deserializeEvmOutput(schema as any, cached.output);
      decodedValue = decoded;
      candidates.push({
        serializedOutput: serializeRespondOutput(respondSchema as any, decoded),
        isFailure: false,
      });
    } catch {
      /* only the failure candidate can match */
    }
  }
  candidates.push({ serializedOutput: MPC_FAILURE_OUTPUT, isFailure: true });
  // Only the candidate the MPC actually attested has a signature that verifies, so the
  // first verifying candidate is the genuine outcome. An undefined return means the post
  // is not up yet (or attests neither candidate) — the caller polls again.
  for (const c of candidates) {
    const event = await reader.getVerifiedRespondBidirectionalEvent(
      requestId,
      c.serializedOutput,
      mpcResponseKey,
    );
    if (event) {
      return {
        event,
        serializedOutput: c.serializedOutput,
        decoded: c.isFailure ? undefined : decodedValue,
        // Transfer schema only: a decoded bool `success`. Swaps read `decoded.amountOut`
        // and treat any non-failure match as success (matchedFailureOutput === false).
        succeeded: !c.isFailure && decodedValue?.success === true,
        matchedFailureOutput: c.isFailure,
      };
    }
  }
  return undefined;
}

// MPC round trip shared by deposit/withdraw/swap: signature -> broadcast -> attestation.
// indexField/schema default to the transfer map (field 0, bool); swaps pass field 11 + the
// uint256 amountOut schema.
async function settleViaMpc(
  providers: any,
  env: Env,
  rid: RequestIdHex,
  expectedSigner: string,
  log: (m: string) => void,
  indexField: number = VAULT_REQUESTS_INDEX_FIELD,
  schema: string = RESULT_SCHEMA,
  respondSchema: string = schema,
  ensureGas?: () => Promise<void>,
): Promise<any> {
  flow.set('settling');
  log('Waiting for MPC signature + settling on Sepolia...');
  const signed = await pollSignatureResponse(
    providers,
    env,
    rid,
    expectedSigner,
    log,
    indexField,
  );
  // A revert is not fatal here: the MPC attests the failed execution and the caller refunds
  // (swap/withdraw) or reports it (deposit). Let it settle, then read the attestation below.
  // ensureGas re-runs the top-up between broadcast retries so an under-funded account never
  // strands the already-burned coin (there is no failure attestation for a never-sent tx).
  await broadcastEvm(env, signed, { throwOnRevert: false, ensureGas });
  const end = Date.now() + 6 * MINUTE;
  while (Date.now() < end) {
    const outcome = await fetchAttestedRespondOutcome(
      providers,
      env,
      rid,
      indexField,
      schema,
      respondSchema,
    );
    if (outcome) return { ...outcome, evmTxHash: signed.hash ?? undefined };
    await sleep(1000);
  }
  throw new Error(
    `timed out waiting for respond-bidirectional attestation for ${rid}`,
  );
}

// deposit() -> MPC round trip -> claim() mints the shielded token.
export async function runDeposit(
  providers: any,
  vault: any,
  env: Env,
  identity: Identity,
  erc20Hex: string,
  amount: bigint,
  log: (m: string) => void,
  onRecord?: (rid: RequestIdHex, evmTxHash?: string) => void,
) {
  flow.start('deposit');
  const erc20 = addrBytes(erc20Hex);
  const userEvm = depositAddress(env, identity);
  const nonce = await evmNonce(env, userEvm);
  log(`Deposit sender ${userEvm} (evm nonce ${nonce})`);

  const before = await readVaultLedger(providers, env);
  if (!before.initialized) throw new Error('vault not initialized');
  const rid = predictRequestId(
    env,
    before,
    identity.commitment,
    nonce,
    erc20,
    before.vaultEvmAddress,
    amount,
  );
  log(`Predicted requestId 0x${rid}`);

  flow.set('proving');
  log('Submitting deposit() on Midnight...');
  await vault.callTx.deposit(
    nonce,
    GAS_LIMIT,
    MAX_FEE,
    PRIORITY_FEE,
    SIGNET_DEFAULT_KEY_VERSION,
    {
      erc20Address: erc20,
      amount,
    },
  );
  await assertRequestOnLedger(providers, env, rid, 'deposit');
  onRecord?.(rid);

  const outcome = await settleViaMpc(providers, env, rid, userEvm, log);
  onRecord?.(rid, outcome.evmTxHash);
  if (!outcome.succeeded)
    throw new Error(`MPC attested deposit ${rid} as FAILED`);

  flow.set('claim-proving');
  log('Submitting claim() to mint shielded token...');
  const selfRecipient = {
    is_some: false,
    value: {
      is_left: true,
      left: { bytes: new Uint8Array(32) },
      right: { bytes: new Uint8Array(32) },
    },
  };
  await vault.callTx.claim(
    requestIdBytes(rid),
    outcome.event,
    outcome.serializedOutput,
    rand32(),
    selfRecipient,
  );
  flow.set('done');
  log('Deposit complete — shielded token minted.');
}

// withdraw() -> MPC round trip -> completeWithdraw() (or refundWithdraw on failure).
export async function runWithdraw(
  providers: any,
  vault: any,
  env: Env,
  identity: Identity,
  erc20Hex: string,
  amount: bigint,
  destHex: string,
  log: (m: string) => void,
  ensureGas?: () => Promise<void>,
  onRecord?: (rid: RequestIdHex, evmTxHash?: string) => void,
) {
  flow.start('withdraw');
  const erc20 = addrBytes(erc20Hex);
  const dest = addrBytes(destHex);
  const vaultEvm = vaultAddress(env);
  const nonce = await evmNonce(env, vaultEvm);
  log(`Withdraw sender (vault) ${vaultEvm} (evm nonce ${nonce})`);

  const before = await readVaultLedger(providers, env);
  if (!before.initialized) throw new Error('vault not initialized');
  const rid = predictRequestId(
    env,
    before,
    VAULT_PATH,
    nonce,
    erc20,
    dest,
    amount,
  );

  const coin = {
    nonce: rand32(),
    color: hexToBytes(vaultTokenType(erc20Hex, env.contractAddress)),
    value: amount,
  };

  flow.set('proving');
  log('Submitting withdraw() (surrendering the vault coin)...');
  await vault.callTx.withdraw(
    nonce,
    SIGNET_DEFAULT_KEY_VERSION,
    { erc20Address: erc20, amount, destEvmAddress: dest },
    coin,
  );
  await assertRequestOnLedger(providers, env, rid, 'withdraw');
  onRecord?.(rid);

  const outcome = await settleViaMpc(
    providers,
    env,
    rid,
    vaultEvm,
    log,
    VAULT_REQUESTS_INDEX_FIELD,
    RESULT_SCHEMA,
    RESULT_SCHEMA,
    ensureGas,
  );
  onRecord?.(rid, outcome.evmTxHash);

  if (outcome.matchedFailureOutput) {
    flow.set('refunding');
    log('EVM transfer never executed — refunding...');
    // refundWithdraw + refundSwap are merged into one `refund` circuit; it routes on which
    // pending-marker map holds the id (refundCommitment here).
    await vault.callTx.refund(
      requestIdBytes(rid),
      outcome.event,
      outcome.serializedOutput,
      rand32(),
    );
    flow.finishRefunded();
    log('Withdraw settled (refunded).');
    return;
  }
  flow.set('claim-proving');
  log('Settling completeWithdraw...');
  await vault.callTx.completeWithdraw(
    requestIdBytes(rid),
    outcome.event,
    outcome.serializedOutput,
    rand32(),
  );
  flow.set('done');
  log('Withdraw finalized (success).');
}

async function evmNonce(env: Env, address: string): Promise<bigint> {
  return BigInt(
    await new JsonRpcProvider(env.evmRpcUrl).getTransactionCount(address),
  );
}

// Ensure the vault account has approved the router for `erc20Hex`: read the live allowance,
// and if zero run the approve leg (approveRouter -> MPC sign (field 0) -> broadcast; NO
// settle). Idempotent and global (one pooled vault account), so a nonzero allowance
// short-circuits and the first swapper readies a token for everyone.
async function ensureRouterApproved(
  providers: any,
  vault: any,
  env: Env,
  erc20Hex: string,
  log: (m: string) => void,
) {
  const vaultEvm = vaultAddress(env);
  const allowance = await routerAllowance(env.evmRpcUrl, erc20Hex, vaultEvm);
  if (allowance > 0n) return;

  log('Approving Uniswap router for this token (one-time)...');
  const erc20 = addrBytes(erc20Hex);
  const nonce = await evmNonce(env, vaultEvm);
  const before = await readVaultLedger(providers, env);
  if (!before.initialized) throw new Error('vault not initialized');
  const rid = predictCallRequestId(
    env,
    before,
    VAULT_PATH,
    nonce,
    erc20,
    MPC_ROUTING,
    GAS_LIMIT,
    MAX_FEE,
    PRIORITY_FEE,
    APPROVE_SELECTOR,
    [
      evmAddressAbiWord(addrBytes(UNISWAP_SWAP_ROUTER_02)),
      numericAbiWord(MAX_APPROVE),
    ],
  );
  await vault.callTx.approveRouter(erc20, nonce, SIGNET_DEFAULT_KEY_VERSION);
  await assertRequestOnLedger(providers, env, rid, 'approveRouter');

  // Sign-only: the vault account signs the approve, the client broadcasts it, done.
  const signed = await pollSignatureResponse(
    providers,
    env,
    rid,
    vaultEvm,
    log,
    VAULT_REQUESTS_INDEX_FIELD,
    3 * MINUTE,
  );
  await broadcastEvm(env, signed);
  log('Router approved.');
}

// approveRouter (once) -> quote -> swap() (burns tokenIn coin, records in swapEventMap) ->
// MPC round trip (field 11) -> completeSwap() mints shielded tokenOut (or refund on EVM
// failure). The vault account holds the pooled funds and both signs + pays for the swap.
// `fee` is the Uniswap V3 pool tier the UI discovered for this pair (default 0.05%).
export async function runSwap(
  providers: any,
  vault: any,
  env: Env,
  identity: Identity,
  tokenInHex: string,
  tokenOutHex: string,
  amountInMaximum: bigint,
  log: (m: string) => void,
  fee = 500n,
  slippageBps = 100n,
  ensureGas?: () => Promise<void>,
  onRecord?: (rid: RequestIdHex, evmTxHash?: string) => void,
) {
  flow.start('swap');
  const tokenIn = addrBytes(tokenInHex);
  const tokenOut = addrBytes(tokenOutHex);
  const vaultEvm = vaultAddress(env);

  // 1. Ready the router allowance for tokenIn (idempotent, global).
  flow.set('preparing');
  await ensureRouterApproved(providers, vault, env, tokenInHex, log);

  // 2. Normal-swap UX, exactOutput on-chain: the user picked the SPEND (amountInMaximum). Quote
  // exactInput to see what it buys, then target amountOut = expected * (1 - slippage) as the
  // guaranteed receive. The swap spends up to amountInMaximum for that output and refunds change.
  const { amountOut: expectedOut } = await quoteExactInputSingle(
    env.evmRpcUrl,
    tokenInHex,
    tokenOutHex,
    fee,
    amountInMaximum,
  );
  const amountOut = (expectedOut * (10_000n - slippageBps)) / 10_000n;
  if (amountOut <= 0n) throw new Error('swap amount too small to quote an output');
  log(
    `Quote: ${amountInMaximum} in -> ~${expectedOut} out (min ${amountOut}, fee ${fee})`,
  );

  // 3. swap(): surrender (burn) amountInMaximum of the tokenIn vault coin, record the
  // exactOutputSingle request. completeSwap returns the unspent remainder as change.
  const nonce = await evmNonce(env, vaultEvm);
  const before = await readVaultLedger(providers, env);
  if (!before.initialized) throw new Error('vault not initialized');
  const rid = predictCallRequestId(
    env,
    before,
    VAULT_PATH,
    nonce,
    addrBytes(UNISWAP_SWAP_ROUTER_02),
    SWAP_MPC_ROUTING,
    SWAP_GAS_LIMIT,
    SWAP_MAX_FEE_PER_GAS,
    SWAP_MAX_PRIORITY_FEE_PER_GAS,
    EXACT_OUTPUT_SINGLE_SELECTOR,
    [
      evmAddressAbiWord(tokenIn),
      evmAddressAbiWord(tokenOut),
      numericAbiWord(fee),
      evmAddressAbiWord(addrBytes(vaultEvm)),
      numericAbiWord(amountOut),
      numericAbiWord(amountInMaximum),
      numericAbiWord(0n),
    ],
  );
  const coin = {
    nonce: rand32(),
    color: hexToBytes(vaultTokenType(tokenInHex, env.contractAddress)),
    value: amountInMaximum,
  };

  flow.set('proving');
  log('Submitting swap() (surrendering the tokenIn vault coin)...');
  await vault.callTx.swap(
    nonce,
    SIGNET_DEFAULT_KEY_VERSION,
    { tokenIn, tokenOut, fee, amountOut, amountInMaximum },
    coin,
  );
  await assertSwapRequestOnLedger(providers, env, rid);
  onRecord?.(rid);

  // 4. MPC signs the swap with the vault account, broadcasts, attests (field 11 + swap schemas:
  // decode the uint256 amountIn, verify against the uint64-packed respond output).
  const outcome = await settleViaMpc(
    providers,
    env,
    rid,
    vaultEvm,
    log,
    VAULT_SWAP_REQUESTS_INDEX_FIELD,
    SWAP_OUTPUT_SCHEMA,
    SWAP_RESPOND_SCHEMA,
    ensureGas,
  );
  onRecord?.(rid, outcome.evmTxHash);

  // 5. Settle: completeSwap mints the exact amountOut of tokenOut plus the unspent tokenIn as
  // change, or refund re-mints amountInMaximum if the EVM swap never executed.
  if (outcome.matchedFailureOutput) {
    flow.set('refunding');
    log('Swap did not execute on EVM — refunding tokenIn...');
    await vault.callTx.refund(
      requestIdBytes(rid),
      outcome.event,
      outcome.serializedOutput,
      rand32(),
    );
    flow.finishRefunded();
    log('Swap refunded (did not execute).');
    return;
  }
  flow.set('claim-proving');
  log('Settling completeSwap (minting shielded tokenOut + change)...');
  await vault.callTx.completeSwap(
    requestIdBytes(rid),
    outcome.event,
    outcome.serializedOutput,
    rand32(),
  );
  flow.set('done');
  log(
    `Swap complete — minted ${amountOut} tokenOut (spent ~${outcome.decoded?.amountIn ?? '?'} tokenIn).`,
  );
}
