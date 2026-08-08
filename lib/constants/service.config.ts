/**
 * Service configuration constants to centralize hardcoded values
 * across the application services.
 */

export const SERVICE_CONFIG = {
  ETHEREUM: {
    /** Sepolia testnet chain ID */
    CHAIN_ID: 11155111,
    /** CAIP-2 chain ID (eip155:chainId format) */
    CAIP2_ID: 'eip155:11155111',
  },
  CRYPTOGRAPHY: {
    /** Signature algorithm for chain signatures */
    SIGNATURE_ALGORITHM: 'ECDSA',
    /** Target blockchain for signatures */
    TARGET_BLOCKCHAIN: 'ethereum',
    /** Root path for withdrawal operations */
    WITHDRAWAL_ROOT_PATH: 'root',
  },
  BALANCE: {
    /** Minimum balance threshold (in token units after decimals) */
    MINIMUM_BALANCE: 0.01,
  },
  RETRY: {
    /** Default key version for request generation */
    DEFAULT_KEY_VERSION: 1,
  },
} as const;
