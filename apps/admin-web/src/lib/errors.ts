export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export function formatApiError(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object') {
    const err = error as Record<string, unknown>;
    if (typeof err.message === 'string') return err.message;
    if (err.error && typeof err.error === 'object') {
      const nested = err.error as Record<string, unknown>;
      if (typeof nested.message === 'string') return nested.message;
    }
  }
  return 'An unexpected error occurred. Please try again.';
}
