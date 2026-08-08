import { PublicKey } from '@solana/web3.js';
import { toBytes } from 'viem';
import { contracts } from 'signet.js';

import { SERVICE_CONFIG } from '@/lib/constants/service.config';

const { getRequestIdBidirectional } = contracts.solana;

/**
 * Generate a request ID for deposit operations.
 * Uses the user's address as the derivation path.
 */
export function generateDepositRequestId(
  vaultAuthority: PublicKey,
  userPath: string,
  rlpEncodedTx: string,
): string {
  return getRequestIdBidirectional({
    sender: vaultAuthority.toString(),
    payload: Array.from(toBytes(rlpEncodedTx)),
    caip2Id: SERVICE_CONFIG.ETHEREUM.CAIP2_ID,
    keyVersion: SERVICE_CONFIG.RETRY.DEFAULT_KEY_VERSION,
    path: userPath,
    algo: SERVICE_CONFIG.CRYPTOGRAPHY.SIGNATURE_ALGORITHM,
    dest: SERVICE_CONFIG.CRYPTOGRAPHY.TARGET_BLOCKCHAIN,
    params: '',
  });
}

/**
 * Generate a request ID for withdrawal operations.
 * Uses the global withdrawal root path.
 */
export function generateWithdrawalRequestId(
  globalVaultAuthority: PublicKey,
  rlpEncodedTx: string,
): string {
  return getRequestIdBidirectional({
    sender: globalVaultAuthority.toString(),
    payload: Array.from(toBytes(rlpEncodedTx)),
    caip2Id: SERVICE_CONFIG.ETHEREUM.CAIP2_ID,
    keyVersion: SERVICE_CONFIG.RETRY.DEFAULT_KEY_VERSION,
    path: SERVICE_CONFIG.CRYPTOGRAPHY.WITHDRAWAL_ROOT_PATH,
    algo: SERVICE_CONFIG.CRYPTOGRAPHY.SIGNATURE_ALGORITHM,
    dest: SERVICE_CONFIG.CRYPTOGRAPHY.TARGET_BLOCKCHAIN,
    params: '',
  });
}
