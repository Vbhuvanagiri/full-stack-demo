export class RateLimitError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export function isRateLimitError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes('429') ||
    message.includes('rate limit') ||
    message.includes('too many requests')
  );
}

export function wrapRateLimitError(error: unknown, operation: string, context?: string): never {
  if (isRateLimitError(error)) {
    const prefix = context ? `[${context}]` : '';
    console.warn(`${prefix} Rate limited during ${operation}, failing fast for retry later`);
    throw new RateLimitError(
      `Solana RPC rate limited during ${operation}. Transaction can be recovered.`,
      operation,
    );
  }
  throw error;
}
