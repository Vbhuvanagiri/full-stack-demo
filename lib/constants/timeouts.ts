export const TIMEOUTS = {
  MPC_EVENT_LISTENER: 300_000,
  MPC_EVENT_WRAPPER: 300_000,
  ETHEREUM_RECEIPT: 180_000,
  BALANCE_POLLING: 300_000,
  SOLANA_CONFIRMATION: 120_000,
  // Deadline before Vercel's maxDuration (300s) to save state gracefully
  FUNCTION_DEADLINE: 270_000,
} as const;
