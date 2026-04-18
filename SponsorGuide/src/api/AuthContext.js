import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getOrCreateDeviceId } from '../storage/inventoryStore';
import { api, ApiError } from './client';

const USER_CACHE_KEY = '@sponsorguide:user';

const AuthContext = createContext({
  user: null,
  loading: true,
  online: true,
  needsOnboarding: false,
  register: async () => {},
  updateName: async () => {},
  refresh: async () => {},
});

/**
 * Bootstrap flow on app launch:
 * 1. Make sure we have a device UUID locally.
 * 2. If we have a cached user, use it immediately (offline-first).
 * 3. Try to fetch /users/me to confirm. On 401, we need onboarding.
 * 4. If offline, keep using the cached user.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  const loadCachedUser = useCallback(async () => {
    const raw = await AsyncStorage.getItem(USER_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  }, []);

  const cacheUser = useCallback(async (u) => {
    if (u) await AsyncStorage.setItem(USER_CACHE_KEY, JSON.stringify(u));
    else await AsyncStorage.removeItem(USER_CACHE_KEY);
  }, []);

  const refresh = useCallback(async () => {
    try {
      await getOrCreateDeviceId();
      const me = await api.getMe();
      setUser(me);
      setOnline(true);
      setNeedsOnboarding(false);
      await cacheUser(me);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        // No server-side user yet — new install
        setOnline(true);
        setNeedsOnboarding(true);
      } else if (err instanceof ApiError && err.status === 0) {
        // Network error — stay with cached user, mark offline
        setOnline(false);
      } else {
        setOnline(false);
      }
    }
  }, [cacheUser]);

  // Initial bootstrap
  useEffect(() => {
    (async () => {
      const cached = await loadCachedUser();
      if (cached) setUser(cached);
      await refresh();
      setLoading(false);
    })();
  }, [loadCachedUser, refresh]);

  const register = useCallback(async (displayName) => {
    const deviceId = await getOrCreateDeviceId();
    const created = await api.createUser(deviceId, displayName);
    setUser(created);
    setNeedsOnboarding(false);
    await cacheUser(created);
    return created;
  }, [cacheUser]);

  const updateName = useCallback(async (displayName) => {
    const updated = await api.updateMe({ display_name: displayName });
    setUser(updated);
    await cacheUser(updated);
    return updated;
  }, [cacheUser]);

  return (
    <AuthContext.Provider
      value={{ user, loading, online, needsOnboarding, register, updateName, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
