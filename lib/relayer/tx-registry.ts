import { Redis } from '@upstash/redis';
import { getFullEnv } from '@/lib/config/env.config';

let cachedRedisClient: Redis | null = null;

function getRedisClient(): Redis {
  if (cachedRedisClient) {
    return cachedRedisClient;
  }
  const env = getFullEnv();
  cachedRedisClient = new Redis({
    url: env.REDIS_URL,
    token: env.REDIS_TOKEN,
  });
  return cachedRedisClient;
}

export type TxStatus =
  | 'pending'
  | 'balance_polling'
  | 'gas_topup_pending'
  | 'solana_pending'
  | 'signature_pending'
  | 'ethereum_pending'
  | 'completing'
  | 'completed'
  | 'failed';

export interface TxEntry {
  id: string;
  requestId?: string;
  type: 'deposit' | 'withdrawal';
  status: TxStatus;
  userAddress: string;
  ethereumAddress?: string;
  error?: string;
  createdAt: number;
  updatedAt: number;
  // Transaction hashes for the full flow
  gasTopUpTxHash?: string;
  solanaInitTxHash?: string;
  ethereumTxHash?: string;
  solanaFinalizeTxHash?: string;
  // Token info for display
  tokenMint?: string;
  tokenAmount?: string;
  tokenDecimals?: number;
  tokenSymbol?: string;
}

const TX_PREFIX = 'tx:';
const USER_TX_PREFIX = 'user-txs:';
const TX_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export async function registerTx(
  id: string,
  type: TxEntry['type'],
  userAddress: string,
  ethereumAddress?: string,
  tokenInfo?: {
    tokenMint?: string;
    tokenAmount?: string;
    tokenDecimals?: number;
    tokenSymbol?: string;
    solanaInitTxHash?: string;
  },
): Promise<void> {
  const redis = getRedisClient();
  const entry: TxEntry = {
    id,
    type,
    userAddress,
    ethereumAddress,
    status: 'pending',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    tokenMint: tokenInfo?.tokenMint,
    tokenAmount: tokenInfo?.tokenAmount,
    tokenDecimals: tokenInfo?.tokenDecimals,
    tokenSymbol: tokenInfo?.tokenSymbol,
    solanaInitTxHash: tokenInfo?.solanaInitTxHash,
  };
  await redis.set(`${TX_PREFIX}${id}`, entry, { ex: TX_TTL_SECONDS });
  // Track transaction ID in user's list
  await redis.sadd(`${USER_TX_PREFIX}${userAddress}`, id);
  await redis.expire(`${USER_TX_PREFIX}${userAddress}`, TX_TTL_SECONDS);
}

export async function updateTxStatus(
  id: string,
  status: TxStatus,
  metadata?: Partial<
    Pick<TxEntry, 'error' | 'gasTopUpTxHash' | 'ethereumTxHash' | 'solanaInitTxHash' | 'solanaFinalizeTxHash' | 'requestId' | 'ethereumAddress' | 'tokenMint' | 'tokenAmount' | 'tokenDecimals' | 'tokenSymbol'>
  >,
): Promise<void> {
  const redis = getRedisClient();
  const entry = await redis.get<TxEntry>(`${TX_PREFIX}${id}`);
  if (!entry) {
    console.warn(`[TxRegistry] Attempted to update non-existent transaction: ${id} to status: ${status}`);
    return;
  }

  const updated: TxEntry = {
    ...entry,
    ...metadata,
    status,
    updatedAt: Date.now(),
  };
  await redis.set(`${TX_PREFIX}${id}`, updated, { ex: TX_TTL_SECONDS });
}

export async function getTxStatus(id: string): Promise<TxEntry | null> {
  const redis = getRedisClient();
  return redis.get<TxEntry>(`${TX_PREFIX}${id}`);
}

const MAX_USER_TRANSACTIONS = 5;

export async function getUserTransactions(
  userAddress: string,
): Promise<TxEntry[]> {
  const redis = getRedisClient();
  const txIds = await redis.smembers(`${USER_TX_PREFIX}${userAddress}`);
  if (!txIds || txIds.length === 0) return [];

  const keys = txIds.map(id => `${TX_PREFIX}${id}`);
  const transactions = await redis.mget<(TxEntry | null)[]>(...keys);

  // Filter nulls and deduplicate by id
  const validTxs = transactions.filter((tx): tx is TxEntry => tx !== null);
  const uniqueTxs = validTxs.filter(
    (tx, index, self) => self.findIndex(t => t.id === tx.id) === index,
  );

  // Sort by creation time (newest first) and limit to MAX_USER_TRANSACTIONS
  const sortedTxs = uniqueTxs.sort((a, b) => b.createdAt - a.createdAt);
  const recentTxs = sortedTxs.slice(0, MAX_USER_TRANSACTIONS);

  // Clean up old transaction IDs from the user's set (fire and forget)
  if (sortedTxs.length > MAX_USER_TRANSACTIONS) {
    const oldTxIds = sortedTxs.slice(MAX_USER_TRANSACTIONS).map(tx => tx.id);
    redis.srem(`${USER_TX_PREFIX}${userAddress}`, ...oldTxIds).catch(() => {});
  }

  // Also clean up any IDs that no longer have data
  const nullIds = txIds.filter(
    id => !validTxs.some(tx => tx.id === id),
  );
  if (nullIds.length > 0) {
    redis.srem(`${USER_TX_PREFIX}${userAddress}`, ...nullIds).catch(() => {});
  }

  return recentTxs;
}
