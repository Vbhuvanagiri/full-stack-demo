import { PublicKey } from '@solana/web3.js';
import { utils as signetUtils } from 'signet.js';
import { publicKeyToAddress } from 'viem/accounts';

import { getClientEnv } from '@/lib/config/env.config';
import { IDL } from '@/lib/program/idl-sol-dex';

const env = getClientEnv();

/**
 * The deployed Solana program ID
 * Reads directly from the IDL to ensure it's always in sync
 */
export const BRIDGE_PROGRAM_ID = new PublicKey(IDL.address);

export const CHAIN_SIGNATURES_PROGRAM_ID = new PublicKey(
  env.NEXT_PUBLIC_CHAIN_SIGNATURES_PROGRAM_ID,
);

/**
 * Chain Signatures MPC configuration
 */
export const CHAIN_SIGNATURES_CONFIG = {
  MPC_ROOT_PUBLIC_KEY: env.NEXT_PUBLIC_MPC_ROOT_PUBLIC_KEY,
  SOLANA_CAIP2_ID: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
  KEY_VERSION: 1,
} as const;

export const RESPONDER_ADDRESS = env.NEXT_PUBLIC_RESPONDER_ADDRESS;

/**
 * Seeds for Program Derived Addresses (PDAs)
 */
const BRIDGE_PDA_SEEDS = {
  VAULT_AUTHORITY: 'vault_authority',
  GLOBAL_VAULT_AUTHORITY: 'global_vault_authority',
  PENDING_ERC20_DEPOSIT: 'pending_erc20_deposit',
  PENDING_ERC20_WITHDRAWAL: 'pending_erc20_withdrawal',
  USER_ERC20_BALANCE: 'user_erc20_balance',
  VAULT_CONFIG: 'vault_config',
} as const;

/**
 * Centralized PDA derivation helpers
 */
export function deriveVaultAuthorityPda(
  userPublicKey: PublicKey,
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(BRIDGE_PDA_SEEDS.VAULT_AUTHORITY), userPublicKey.toBuffer()],
    BRIDGE_PROGRAM_ID,
  );
}

export function derivePendingDepositPda(
  requestIdBytes: number[],
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(BRIDGE_PDA_SEEDS.PENDING_ERC20_DEPOSIT),
      Buffer.from(requestIdBytes),
    ],
    BRIDGE_PROGRAM_ID,
  );
}

export function derivePendingWithdrawalPda(
  requestIdBytes: number[],
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(BRIDGE_PDA_SEEDS.PENDING_ERC20_WITHDRAWAL),
      Buffer.from(requestIdBytes),
    ],
    BRIDGE_PROGRAM_ID,
  );
}

export function deriveUserBalancePda(
  userPublicKey: PublicKey,
  erc20AddressBytes: Buffer,
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(BRIDGE_PDA_SEEDS.USER_ERC20_BALANCE),
      userPublicKey.toBuffer(),
      erc20AddressBytes,
    ],
    BRIDGE_PROGRAM_ID,
  );
}

export function deriveConfigPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(BRIDGE_PDA_SEEDS.VAULT_CONFIG)],
    BRIDGE_PROGRAM_ID,
  );
}

/**
 * Derive public key using signet.js cryptography utilities
 * Uses the same derivation method as the MPC contract tests
 */
function deriveChildPublicKey(
  path: string,
  requesterAddress: string,
  basePublicKey: string,
): `04${string}` {
  // signet.js expects the public key without 0x prefix (format: 04...)
  const normalizedPubKey = basePublicKey.startsWith('0x')
    ? basePublicKey.slice(2)
    : basePublicKey;
  return signetUtils.cryptography.deriveChildPublicKey(
    normalizedPubKey as `04${string}`,
    requesterAddress,
    path,
    CHAIN_SIGNATURES_CONFIG.SOLANA_CAIP2_ID,
    CHAIN_SIGNATURES_CONFIG.KEY_VERSION,
  );
}

/**
 * Derive Ethereum address from public key and path
 */
export function deriveEthereumAddress(
  path: string,
  requesterAddress: string,
  basePublicKey: string,
): string {
  const derivedPublicKey = deriveChildPublicKey(
    path,
    requesterAddress,
    basePublicKey,
  );
  return publicKeyToAddress(`0x${derivedPublicKey}` as `0x${string}`);
}

/**
 * Global Vault Authority PDA - used for withdrawals
 */
export const GLOBAL_VAULT_AUTHORITY_PDA = PublicKey.findProgramAddressSync(
  [Buffer.from(BRIDGE_PDA_SEEDS.GLOBAL_VAULT_AUTHORITY)],
  BRIDGE_PROGRAM_ID,
)[0];

/**
 * Global Vault Ethereum Address
 * This is the main vault address where all deposits go and withdrawals come from
 * Derived programmatically from the global vault authority PDA
 */
export const VAULT_ETHEREUM_ADDRESS = (() => {
  try {
    const derivedPublicKey = deriveChildPublicKey(
      'root',
      GLOBAL_VAULT_AUTHORITY_PDA.toString(),
      CHAIN_SIGNATURES_CONFIG.MPC_ROOT_PUBLIC_KEY,
    );
    return publicKeyToAddress(`0x${derivedPublicKey}` as `0x${string}`);
  } catch (error) {
    throw new Error(
      `Failed to derive vault address: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
})();
