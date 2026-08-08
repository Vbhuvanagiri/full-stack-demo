import { TIMEOUTS } from '@/lib/constants/timeouts';
import { updateTxStatus } from '@/lib/relayer/tx-registry';

export class FunctionDeadlineError extends Error {
  constructor(
    message: string,
    public readonly trackingId: string,
  ) {
    super(message);
    this.name = 'FunctionDeadlineError';
  }
}

type HandlerResult = { ok: boolean; error?: string };

export async function withFunctionDeadline<T extends HandlerResult>(
  trackingId: string,
  operationType: 'deposit' | 'withdrawal',
  handler: () => Promise<T>,
): Promise<T> {
  const deadlineMs = TIMEOUTS.FUNCTION_DEADLINE;

  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(
        new FunctionDeadlineError(
          `${operationType} timed out after ${deadlineMs / 1000}s. Use recovery endpoint to retry.`,
          trackingId,
        ),
      );
    }, deadlineMs);
  });

  try {
    const result = await Promise.race([handler(), timeoutPromise]);
    return result;
  } catch (error) {
    if (error instanceof FunctionDeadlineError) {
      console.error(
        `[DEADLINE] ${operationType} function deadline reached for ${trackingId}`,
      );
      await updateTxStatus(trackingId, 'failed', {
        error: error.message,
      });
      return { ok: false, error: error.message } as T;
    }
    throw error;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
