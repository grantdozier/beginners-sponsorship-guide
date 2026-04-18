import { useEffect, useRef, useState, useCallback } from 'react';
import { loadInventory, saveInventory } from '../storage/inventoryStore';
import { api, ApiError } from './client';
import { useAuth } from './AuthContext';

/**
 * Hook that manages inventory data for a given type.
 *
 * Offline-first behavior:
 * - Mount: load from AsyncStorage immediately; kick off a server fetch in background.
 * - If server has newer data (later updated_at), hydrate from server and persist locally.
 * - Every change: write local immediately, debounce a server sync 800ms later.
 * - If offline, keeps working; next time we're online, local wins (unless server is newer
 *   from another device — edge case, not MVP).
 *
 * Returns: { data, setData, status, lastSyncedAt, shared, sharedAt, share }
 *   status: 'loading' | 'idle' | 'saving' | 'saved' | 'error' | 'offline'
 */
export function useInventorySync(type, emptyFactory) {
  const { user, online } = useAuth();
  const [data, setDataState] = useState(null);
  const [status, setStatus] = useState('loading');
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [shared, setShared] = useState(false);
  const [sharedAt, setSharedAt] = useState(null);
  const saveTimer = useRef(null);
  const latestRef = useRef(null); // holds the latest data for the save timer to use
  latestRef.current = data;

  // ----- load (local first, then server) -----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const local = await loadInventory(type);
      if (!cancelled) setDataState(local || emptyFactory());

      if (!user || !online) {
        if (!cancelled) setStatus(online ? 'idle' : 'offline');
        return;
      }

      try {
        const server = await api.listInventories();
        const match = server.find((inv) => inv.type === type);
        if (cancelled) return;

        if (match) {
          const localStamp = local?._server_updated_at;
          const serverIsNewer =
            !localStamp || new Date(match.updated_at) > new Date(localStamp);
          if (serverIsNewer) {
            const hydrated = { ...match.data, _server_updated_at: match.updated_at };
            await saveInventory(type, hydrated);
            setDataState(hydrated);
          }
          setShared(match.is_shared);
          setSharedAt(match.shared_at);
          setLastSyncedAt(match.updated_at);
        }
        setStatus('idle');
      } catch (err) {
        if (err instanceof ApiError && err.status === 0) setStatus('offline');
        else setStatus('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [type, emptyFactory, user, online]);

  // Update + schedule sync
  const setData = useCallback(
    (updater) => {
      setDataState((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        latestRef.current = next;
        // write to AsyncStorage immediately
        saveInventory(type, next).catch(() => {});
        if (!user || !online) {
          setStatus(online ? 'idle' : 'offline');
          return next;
        }
        setStatus('saving');
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(async () => {
          try {
            const { _server_updated_at, ...payload } = latestRef.current || {};
            const result = await api.upsertInventory(type, payload);
            // stamp local with the server's updated_at so we don't fight ourselves
            const withStamp = { ...payload, _server_updated_at: result.updated_at };
            await saveInventory(type, withStamp);
            latestRef.current = withStamp;
            setDataState(withStamp);
            setLastSyncedAt(result.updated_at);
            setShared(result.is_shared);
            setSharedAt(result.shared_at);
            setStatus('saved');
          } catch (err) {
            if (err instanceof ApiError && err.status === 0) setStatus('offline');
            else setStatus('error');
          }
        }, 800);
        return next;
      });
    },
    [type, user, online],
  );

  const share = useCallback(async () => {
    const result = await api.shareInventory(type);
    setShared(result.is_shared);
    setSharedAt(result.shared_at);
    return result;
  }, [type]);

  return { data, setData, status, lastSyncedAt, shared, sharedAt, share };
}
