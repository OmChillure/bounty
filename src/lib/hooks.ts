"use client";

import { useEffect, useState, useCallback } from "react";

type UseQueriesProps<T, P extends any[]> = {
  fn: (...params: P) => Promise<T>;
  params?: Partial<P>;
};

export const useQueries = <T, P extends any[]>({
  fn,
  params = [] as unknown as P,
  enabled = true,
}: UseQueriesProps<T, P> & { enabled?: boolean }) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const stableParams = JSON.stringify(params);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fn(...(params as P));
      setData(res);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [fn, stableParams, enabled]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [fetchData, enabled]);

  const refetch = useCallback(() => {
    if (enabled) {
      fetchData();
    }
  }, [fetchData, enabled]);

  return { data, loading, error, refetch };
};