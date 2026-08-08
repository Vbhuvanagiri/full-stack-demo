/**
 * Executes a function with exponential backoff retry logic.
 *
 * @param fn - The async function to execute
 * @param options - Configuration options for retry behavior
 * @returns The result of the function if successful
 * @throws The last error encountered if all retries fail
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelayMs?: number;
    context?: string;
    onRetry?: (attempt: number, error: unknown, delayMs: number) => void;
  } = {},
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelayMs = 1000,
    context = 'operation',
    onRetry,
  } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        break;
      }

      const delayMs = baseDelayMs * Math.pow(2, attempt - 1);

      if (onRetry) {
        onRetry(attempt, error, delayMs);
      } else {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.warn(
          `[${context}] Attempt ${attempt}/${maxRetries} failed: ${errorMessage}. Retrying in ${delayMs}ms...`,
        );
      }

      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}
