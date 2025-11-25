export interface Result<T> {
  data: T | null;
  error: string | null;
}

export async function safeFetch<T>(
  promise: Promise<T>
): Promise<Result<T>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'An unexpected error occurred';
    console.error('safeFetch error:', err);
    return { data: null, error };
  }
}
