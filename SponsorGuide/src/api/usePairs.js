import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from './client';
import { useAuth } from './AuthContext';

/**
 * Fetch and cache the list of pairs for the current user. Refreshes on mount
 * and exposes a manual refresh to call after pairing/unpairing actions.
 */
export function usePairs() {
  const { user, online } = useAuth();
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setPairs([]);
      setLoading(false);
      return;
    }
    try {
      const rows = await api.listPairs();
      setPairs(rows);
      setError(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        setError('offline');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh, online]);

  return { pairs, loading, error, refresh };
}
