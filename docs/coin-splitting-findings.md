# Coin-splitting / partial-withdrawal findings

Investigation only. No files other than this one were modified; nothing was executed or submitted to any network.

## 0. Where the Compact source is (and isn't)

The `.compact` source for the vault contract itself (`erc20-vault.compact`) is **not present anywhere in this repo or in `node_modules`**. I searched the whole filesystem for `*.compact` files and only found:

- `node_modules/.pnpm/@sig-net+midnight@0.19.0_.../node_modules/@sig-net/midnight/src/Signet.compact` — the shared Signet/MPC library (signing requests, attestations, ABI word helpers). No coin/withdraw logic.
- `node_modules/.pnpm/@sig-net+midnight@0.19.0_.../node_modules/@sig-net/midnight/src/circuits.compact` — just re-exports Signet's pure circuits for testing.

The vault's own logic exists locally only as **compiled output**: [lib/midnight/managed/erc20-vault/contract/index.js](lib/midnight/managed/erc20-vault/contract/index.js) (compiled circuit bodies, transpiled from Compact to JS by `compactc`) and [index.d.ts](lib/midnight/managed/erc20-vault/contract/index.d.ts) (generated TypeScript types). The compiled JS embeds the *original source filename and line numbers* in its assertion/error strings (e.g. `'erc20-vault.compact line 428 char 10'`), which proves such a file existed at compile time and lets me cite exact original source lines for some checks — but the source text itself is gone from this checkout. Per your instructions, I have **not** inferred circuit semantics from `vault.ts` alone; the answers below on the circuit's actual behavior (Q1, Q2) come from reading the compiled circuit body directly (`_withdraw_0` in `index.js`), which is the literal code that executes — not the hand-written TypeScript wrapper.

If you want the actual `.compact` text (for a byte-for-byte read, or to recompile), it needs to be pulled from `sig-net/midnight-examples` (erc20-vault) upstream — I did not fetch it since this task was scoped to local files only.

---

## Q1: Does `withdraw` accept an oversized coin, or require exact equality?

**Answer: exact equality is required. An oversized coin is rejected outright.**

The compiled circuit body for `withdraw` contains:

```
// lib/midnight/managed/erc20-vault/contract/index.js:2679-2682
__compactRuntime.assert(this._equal_3(coin_0.color, color_0),
                        'Coin is not the vault token for this ERC20');
__compactRuntime.assert(coin_0.value === withdrawRequest_0.amount,
                        'Coin value must equal the withdraw amount');
```

`coin_0` is the `coin` argument passed by the caller (typed `{ nonce: Bytes<32>, color: Bytes<32>, value: Uint<64> }` per [index.d.ts:38-45](lib/midnight/managed/erc20-vault/contract/index.d.ts)). The check is `===` (strict equality on the value field), not `>=`. There is no branch anywhere in `_withdraw_0` ([index.js:2629-2867](lib/midnight/managed/erc20-vault/contract/index.js)) that accepts `coin_0.value > withdrawRequest_0.amount` — if `coin_0.value` is anything other than exactly `withdrawRequest_0.amount`, this `assert` fails and the circuit (and therefore the whole transaction) aborts with `'Coin value must equal the withdraw amount'`. Also note lines 2660-2665 separately assert `amount > 0` and `amount <= Uint<64>::MAX`, but those are about the requested `amount`, not the coin.

**Confidence: CONFIRMED.** This is read directly from the compiled circuit body — the actual code the proof server executes — not the TS wrapper. The corresponding error-message text is unambiguous and there is exactly one such assert in the function.

---

## Q2: What happens to the change (X − Y) if you tried to pass an oversized coin?

**Answer: nothing — there is no "change" pathway inside the circuit, because Q1's exact-equality assert rejects an oversized coin before any value is moved. The circuit only ever consumes a coin worth precisely the requested `amount`.**

Following the exact-match check, `_withdraw_0` calls:

```
// lib/midnight/managed/erc20-vault/contract/index.js:2777
await this._receiveShielded_0(context, partialProofData, coin_0);
```

`_receiveShielded_0` ([index.js:1597-1630](lib/midnight/managed/erc20-vault/contract/index.js)) does this:

```js
async _receiveShielded_0(context, partialProofData, coin_0) {
  const recipient_0 = this._right_0(/* ... reads a ledger field ... */);
  this._createZswapOutput_0(context, partialProofData, coin_0, recipient_0);
  const tmp_0 = this._coinCommitment_0(coin_0, recipient_0);
  /* ... inserts tmp_0 into a Set-typed ledger field via 'ins' ... */
  return [];
}
```

and `_createZswapOutput_0` ([index.js:1748-1757](lib/midnight/managed/erc20-vault/contract/index.js)) is a thin wrapper over the compact-runtime primitive:

```js
_createZswapOutput_0(context, partialProofData, coin_0, recipient_0) {
  const result_0 = __compactRuntime.createZswapOutput(context, coin_0, recipient_0);
  ...
}
```

So "receiving" a coin in this contract means: **mint a brand-new Zswap output commitment** for exactly `coin_0` (nonce/color/value as given) owned by `recipient_0` (a contract-side commitment read from ledger state), then record that commitment in the ledger's tracking set. It is a *mint of a new output*, not a *spend of an existing input* — there is no nullifier check, no Merkle-path verification of a pre-existing commitment for `coin_0`, and critically no code path that ever produces a second, smaller coin as "change" back to the caller. Since `coin_0.value` must already equal `withdrawRequest_0.amount` (Q1), the concept of "change" simply doesn't arise inside this circuit: the circuit never sees or handles a coin larger than the withdrawal amount in the first place.

Where the *real* splitting of a bigger held coin into "amount to the contract" + "change back to the caller" must happen, if it happens at all, is one layer up, at the wallet's transaction-balancing step — not in this circuit. Evidence for that layer:

```
// node_modules/.pnpm/@midnight-ntwrk+midnight-js-types@5.0.0-beta.6/.../dist/index.d.ts:839-848
Creates call proofs for an unproven transaction. The resulting transaction is unbalanced and
must be balanced using the {@link WalletProvider} interface.
...
proveTx(unprovenTx: UnprovenTransaction, proveTxConfig?: ProveTxConfig): Promise<UnboundTransaction>;
```

```
// node_modules/.pnpm/@midnight-ntwrk+midnight-js-types@5.0.0-beta.6/.../dist/wallet-provider.d.ts:7-16
export interface WalletProvider {
    balanceTx(tx: UnboundTransaction, ttl?: Date): Promise<FinalizedTransaction>;
    ...
}
```

```
// node_modules/.pnpm/@midnight-ntwrk+midnight-js-contracts@5.0.0-beta.6/.../dist/tx-model.d.ts:22-31
export interface UnsubmittedTxData {
    readonly unprovenTx: UnprovenTransaction;
    /** New coins created during the construction of the transaction. */
    readonly newCoins: ShieldedCoinInfo[];
}
```

A circuit that "receives" a shielded coin worth `amount` produces an unbalanced transaction (value appears from nowhere from the ledger's point of view) until `WalletProvider.balanceTx` adds real spend(s) of the caller's actual owned coin(s) of that color to cover it. In UTXO/Zswap-style systems, spending a coin nullifies it *entirely* — you cannot partially spend a coin worth X to pay Y < X without generating a second output for the remainder — so if this is what `balanceTx` does, the X−Y remainder would come back to the caller as an ordinary new shielded coin (the `newCoins` mentioned in the type above), not sent to the contract and not destroyed.

**Confidence: CONFIRMED that the circuit itself has no change logic and never receives more than the exact requested amount.** **INFERRED (not CONFIRMED)** that the wallet's `balanceTx` step automatically produces a change coin back to the caller when balancing a bigger held coin against this exact-amount requirement — that specific claim rests on SDK type declarations and doc comments ("unbalanced... must be balanced", "new coins created during construction"), not on reading `balanceTx`'s actual implementation (it lives in a compiled/wasm-backed package I did not trace further, and doing so was out of scope for a docs-only, no-execution task).

**Smallest safe empirical test to settle the INFERRED part:** On a devnet/testnet (never mainnet), fund an identity with a single vault-token coin worth X (e.g. deposit once, so the wallet holds exactly one shielded UTXO of that color). Call `runWithdraw` (or the underlying `vault.callTx.withdraw`) requesting `amount = Y` with `0 < Y < X`. Do **not** pre-build the coin argument as `vault.ts` does with a `value: amount` you haven't verified against your real balance — first confirm your only held coin's value via the wallet state (`facade.state()`/`readColorBalance`-style read as in [scripts/transfer-shielded.ts:251-260](scripts/transfer-shielded.ts)). Given Q1's exact-match assert, the run should either (a) fail at proving/balancing because the wallet cannot supply a coin of value exactly Y without splitting X first, or (b) succeed via `balanceTx` auto-splitting X into a Y-output-to-contract plus an (X−Y)-output-to-self. After it settles, re-read the wallet's shielded balance and full UTXO/coin list for that color: if it shows a remaining balance of exactly X−Y (not 0, not X), that confirms change was minted back to the caller. Worst case if the answer is "destroyed instead of returned": you lose X−Y of the smallest denomination you can afford to test with (e.g. a few raw units of a testnet ERC-20), not the whole coin — so size the test amount to the minimum you're willing to risk, and do it on stagenet/testnet funds only.

---

## Q3: What does the app's existing withdraw path ("Send" screen) actually do?

**Answer: no coin selection or splitting happens anywhere in the app. It passes a synthetic coin object whose `value` is hard-set to exactly the amount the user typed, and it does not use the wallet SDK's high-level automatic-coin-selection API at all.**

The UI path: [components/withdraw-dialog/index.tsx](components/withdraw-dialog/index.tsx) takes a free-text `amount` field (line 52), parses it with `parseUnits` (line 63), and threads it through to [providers/midnight-context.tsx:269](providers/midnight-context.tsx:269), which calls:

```
await runWithdraw(providers, vault, midnightEnv, identity, erc20Address, amountUnits, destHex, append, ...)
```

`runWithdraw` in [lib/midnight/vault.ts:577-663](lib/midnight/vault.ts:577-663) builds the coin argument itself, with no reference to any actual held UTXO:

```
// lib/midnight/vault.ts:608-621
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
```

`rand32()` is a fresh, uniformly random 32-byte value ([lib/midnight/vault.ts:86](lib/midnight/vault.ts:86)) — not derived from, or checked against, any coin the wallet actually holds. `coin.value` is literally the user-requested `amount`, never the caller's real balance. There is no call anywhere in `vault.ts`, `midnight-context.tsx`, or the withdraw dialog to a coin-listing/selection API (I grepped the whole app tree for `QualifiedShieldedCoinInfo`, `QualifiedCoinInfo`, `unspentCoins`, `coinSelection`, `selectCoin` and found zero matches outside this doc). The app relies entirely on `vault.callTx.withdraw(...)` (the generic contract-call proxy from `@midnight-ntwrk/midnight-js-contracts`) and whatever `WalletProvider.balanceTx` does under the hood (see Q2) to reconcile this synthetic `coin` claim against the caller's real shielded balance.

This is a materially different code path from [scripts/transfer-shielded.ts](scripts/transfer-shielded.ts), which calls the wallet facade's high-level transfer primitive instead of a contract circuit:

```
// scripts/transfer-shielded.ts:348-357
const recipe = await facade.transferTransaction(
  [{ type: 'shielded', outputs: [{ type: color, receiverAddress, amount }] }],
  { shieldedSecretKeys: keys.shieldedSecretKeys, dustSecretKey: keys.dustSecretKey },
  { ttl, payFees: true },
);
```

The script's own header comment states explicitly (this is the script author's claim, not verified by me against `facade` source):

```
// scripts/transfer-shielded.ts:10-11
The SDK's coin selection handles UTXO splitting/change internally — callers only ever
specify destination + color + amount, never individual coins.
```

So: `transfer-shielded.ts` never constructs a coin object and delegates all UTXO-level mechanics to `facade.transferTransaction`. `vault.ts`'s `runWithdraw` does the opposite — it hand-builds a coin object with a fabricated nonce and a value equal to the requested amount, and hands it straight to the contract circuit, doing no selection or splitting of its own.

**Confidence: CONFIRMED.** All of the above is read directly from the three files cited (`withdraw-dialog/index.tsx`, `midnight-context.tsx`, `vault.ts`, `transfer-shielded.ts`), plus a whole-repo grep confirming no other coin-selection code exists in the app. What is **not** confirmed is what `vault.callTx.withdraw(...)` → `balanceTx` does internally with that synthetic coin claim when the caller's real balance is a single larger coin — that's the same open question as Q2's INFERRED part, and the same empirical test applies.

---

## Q4: Can the wallet SDK split one shielded coin into two without involving the vault contract?

**Answer: yes, via the wallet facade's generic shielded-transfer primitive (`facade.transferTransaction`), which this repo already uses in `transfer-shielded.ts` for peer-to-peer transfers — the same call shape would work for a self-transfer.**

`facade.transferTransaction` ([scripts/transfer-shielded.ts:348-357](scripts/transfer-shielded.ts:348-357)) takes only `{ type: 'shielded', outputs: [{ type: color, receiverAddress, amount }] }` — a destination address, a token color, and an amount. It does not take a coin/nonce argument at all. Per the script's own comment (line 10-11, quoted above), coin selection and change are handled internally by the SDK. Nothing in that call shape requires `receiverAddress` to differ from the sender's own shielded address — setting `receiverAddress` to the caller's own address would, structurally, be an ordinary shielded transfer to self for `amount`, which (if the "handles splitting/change internally" comment is accurate) would leave the wallet holding two coins of the same color: one of value `amount` and one of value `X - amount` (the automatic change), without ever touching `vault.callTx` or the vault contract.

**Confidence: INFERRED, not CONFIRMED.** I did not find and read the actual implementation of `facade.transferTransaction`'s coin-selection/change logic (it lives in the `@midnightntwrk/wallet-sdk-*` family, e.g. `wallet-sdk-shielded` / `wallet-sdk-facade`, which I located in `node_modules` but did not trace function-by-function — doing so thoroughly was beyond this task's read-only, no-execution scope). The claim rests on (a) the call's own type shape (no per-coin argument, so it must be selecting internally), and (b) the script author's comment asserting this behavior, not on independently verified source. I also have not confirmed that a self-transfer (`receiverAddress == own address`) is accepted rather than special-cased/rejected.

**Smallest safe empirical test to settle this:** On stagenet/testnet, run `scripts/transfer-shielded.ts` with `--to` set to the *same* identity's own shielded address (derive it once via `deriveAccountKeys`/`initialiseWalletFacade` the same way the script already does for the sender) and `--amount` less than your full held coin, first as a dry run (default, no `--confirm`) to confirm it builds without error, then with `--confirm` on a small amount. Worst case if self-transfer is rejected: the dry run or `validateTransaction` step (lines 363-371) fails cleanly before anything is submitted — no funds at risk. Worst case if it's accepted but doesn't split as expected: you've moved a small test amount within your own wallet, which is recoverable (it's still your coin, just possibly not split into the denominations you wanted) — so this test costs at most a devnet/testnet round-trip, no real value.

---

## Summary table

| # | Question | Answer | Confidence |
|---|---|---|---|
| 1 | Exact match or `>=`? | Exact match only (`coin_0.value === withdrawRequest_0.amount`); oversized coin is rejected | CONFIRMED |
| 2 | What happens to change? | No change logic in-circuit (nothing to split — Q1 rejects it first); if the wallet's `balanceTx` splits a bigger real coin to satisfy the exact-match requirement, standard UTXO change semantics imply the remainder returns to the caller as a new shielded coin, but this is not verified against `balanceTx`'s actual implementation | Circuit behavior: CONFIRMED. Wallet-level change-return: INFERRED |
| 3 | Does the app's Send screen select/split coins? | No — it fabricates a coin object with a random nonce and `value = requested amount`, and passes it straight to `vault.callTx.withdraw`; no coin listing, selection, or splitting code exists in the app | CONFIRMED |
| 4 | Can the SDK split a coin without the vault contract? | Likely yes, via `facade.transferTransaction` to one's own address (same primitive `transfer-shielded.ts` uses for peer transfers) | INFERRED |

**Bottom line for the original scenario (one coin worth X, want to withdraw Y < X):** calling `runWithdraw`/`vault.callTx.withdraw` today with `amount = Y` while your only real coin is worth X will hand the circuit a coin claim of value Y that does not correspond to any coin you actually hold at that exact value — whether that succeeds (via automatic wallet-side splitting of your X-coin into Y + change) or fails outright at balancing/proving is the one load-bearing unknown in this whole flow, and it has not been empirically tested here. Do not attempt a real partial withdrawal against a single oversized coin before running the Q2/Q4 empirical tests on testnet/stagenet first.
