import { z } from 'zod';

/**
 * Environment variable configuration
 * Single source of truth for all env vars across the application
 */

// Client-side environment variables (accessible in browser)
const clientEnvSchema = z.object({
  // Single Sepolia JSON-RPC endpoint (any provider) for all EVM calls.
  NEXT_PUBLIC_SEPOLIA_RPC_URL: z
    .string()
    .url({ message: 'Sepolia RPC URL is required' }),
  // Only used by the Solana devnet RPC + Alchemy-SDK token service.
  NEXT_PUBLIC_ALCHEMY_API_KEY: z.string().optional(),
  NEXT_PUBLIC_HELIUS_RPC_URL: z.string().optional(),
  NEXT_PUBLIC_NOTIFY_DEPOSIT_URL: z.string().optional(),
  NEXT_PUBLIC_NOTIFY_WITHDRAWAL_URL: z.string().optional(),
  NEXT_PUBLIC_CHAIN_SIGNATURES_PROGRAM_ID: z
    .string()
    .min(1, 'Chain signatures program ID is required'),
  NEXT_PUBLIC_RESPONDER_ADDRESS: z
    .string()
    .min(1, 'Responder address is required'),
  NEXT_PUBLIC_MPC_ROOT_PUBLIC_KEY: z
    .string()
    .min(1, 'Base public key is required'),
});

// Server-side only environment variables
const serverEnvSchema = z.object({
  RELAYER_PRIVATE_KEY: z.string().min(1, 'Relayer private key is required'),
  MPC_ROOT_KEY: z
    .string()
    .regex(
      /^0x[a-fA-F0-9]{64}$/,
      'MPC root key must be 0x-prefixed 64-char hex',
    )
    .optional(),
  INFURA_API_KEY: z.string().min(1, 'Infura API key is required'),
  REDIS_URL: z.string().min(1, 'Redis URL is required'),
  REDIS_TOKEN: z.string().min(1, 'Redis token is required'),
});

// Full environment schema (client + server)
const fullEnvSchema = clientEnvSchema.merge(serverEnvSchema);

// Type exports
export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type FullEnv = z.infer<typeof fullEnvSchema>;

/**
 * Get and validate client environment variables
 * Can be called from both client and server
 */
export function getClientEnv(): ClientEnv {
  const rawEnv: Record<string, string | undefined> = {
    NEXT_PUBLIC_SEPOLIA_RPC_URL: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
    NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    NEXT_PUBLIC_HELIUS_RPC_URL: process.env.NEXT_PUBLIC_HELIUS_RPC_URL,
    NEXT_PUBLIC_NOTIFY_DEPOSIT_URL: process.env.NEXT_PUBLIC_NOTIFY_DEPOSIT_URL,
    NEXT_PUBLIC_NOTIFY_WITHDRAWAL_URL:
      process.env.NEXT_PUBLIC_NOTIFY_WITHDRAWAL_URL,
    NEXT_PUBLIC_CHAIN_SIGNATURES_PROGRAM_ID:
      process.env.NEXT_PUBLIC_CHAIN_SIGNATURES_PROGRAM_ID,
    NEXT_PUBLIC_RESPONDER_ADDRESS: process.env.NEXT_PUBLIC_RESPONDER_ADDRESS,
    NEXT_PUBLIC_MPC_ROOT_PUBLIC_KEY:
      process.env.NEXT_PUBLIC_MPC_ROOT_PUBLIC_KEY,
  };

  try {
    return clientEnvSchema.parse(rawEnv);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      throw new Error(`Client environment validation failed: ${missingVars}`);
    }
    throw error;
  }
}

/**
 * Get and validate full environment variables (server-side only)
 * Throws error if called from client
 */
export function getFullEnv(): FullEnv {
  if (typeof window !== 'undefined') {
    throw new Error('getFullEnv() should only be called on the server side');
  }

  const rawEnv: Record<string, string | undefined> = {
    NEXT_PUBLIC_SEPOLIA_RPC_URL: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
    NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    NEXT_PUBLIC_HELIUS_RPC_URL: process.env.NEXT_PUBLIC_HELIUS_RPC_URL,
    NEXT_PUBLIC_NOTIFY_DEPOSIT_URL: process.env.NEXT_PUBLIC_NOTIFY_DEPOSIT_URL,
    NEXT_PUBLIC_NOTIFY_WITHDRAWAL_URL:
      process.env.NEXT_PUBLIC_NOTIFY_WITHDRAWAL_URL,
    NEXT_PUBLIC_CHAIN_SIGNATURES_PROGRAM_ID:
      process.env.NEXT_PUBLIC_CHAIN_SIGNATURES_PROGRAM_ID,
    NEXT_PUBLIC_RESPONDER_ADDRESS: process.env.NEXT_PUBLIC_RESPONDER_ADDRESS,
    NEXT_PUBLIC_MPC_ROOT_PUBLIC_KEY:
      process.env.NEXT_PUBLIC_MPC_ROOT_PUBLIC_KEY,
    RELAYER_PRIVATE_KEY: process.env.RELAYER_PRIVATE_KEY,
    MPC_ROOT_KEY: process.env.MPC_ROOT_KEY,
    INFURA_API_KEY: process.env.INFURA_API_KEY,
    REDIS_URL:
      process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
    REDIS_TOKEN:
      process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
  };

  try {
    return fullEnvSchema.parse(rawEnv);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      throw new Error(`Environment validation failed: ${missingVars}`);
    }
    throw error;
  }
}
