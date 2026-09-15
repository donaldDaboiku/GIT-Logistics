import axios from 'axios';

export function apiErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;
    const firstFieldError = data?.errors ? Object.values(data.errors).flat()[0] : undefined;
    if (firstFieldError) return firstFieldError;
    if (data?.message) return data.message;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
