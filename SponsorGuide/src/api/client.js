import { API_BASE_URL } from './config';
import { getOrCreateDeviceId } from '../storage/inventoryStore';

class ApiError extends Error {
  constructor(status, payload) {
    super(payload?.message || `HTTP ${status}`);
    this.status = status;
    this.payload = payload;
  }
}

async function request(path, { method = 'GET', body, noAuth = false, timeout = 15000 } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (!noAuth) {
    headers['X-Device-Id'] = await getOrCreateDeviceId();
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    throw new ApiError(0, { error: 'network', message: err.message });
  }
  clearTimeout(timer);

  const text = await res.text();
  const payload = text ? JSON.parse(text) : null;
  if (!res.ok) throw new ApiError(res.status, payload);
  return payload;
}

export const api = {
  // Users
  createUser: (deviceId, displayName) =>
    request('/users', { method: 'POST', body: { device_id: deviceId, display_name: displayName }, noAuth: true }),
  getMe: () => request('/users/me'),
  updateMe: (patch) => request('/users/me', { method: 'PATCH', body: patch }),
  deleteMe: () => request('/users/me', { method: 'DELETE' }),

  // Pair codes & pairs
  createPairCode: (role) => request('/pair-codes', { method: 'POST', body: { role } }),
  redeemPairCode: (code) => request(`/pair-codes/${code.toUpperCase()}/redeem`, { method: 'POST' }),
  listPairs: () => request('/pairs'),
  unpair: (pairId) => request(`/pairs/${pairId}`, { method: 'DELETE' }),

  // Inventories
  listInventories: () => request('/inventories'),
  upsertInventory: (type, data) => request(`/inventories/${type}`, { method: 'PUT', body: { data } }),
  shareInventory: (type) => request(`/inventories/${type}/share`, { method: 'POST' }),
  unshareInventory: (type) => request(`/inventories/${type}/share`, { method: 'DELETE' }),
  deleteInventory: (type) => request(`/inventories/${type}`, { method: 'DELETE' }),

  // Partner inventories
  getPartnerInventories: (pairId) => request(`/partners/${pairId}/inventories`),
  getPartnerInventory: (pairId, type) => request(`/partners/${pairId}/inventories/${type}`),

  // Progress
  listProgress: (pairId) => request(`/pairs/${pairId}/progress`),
  upsertProgress: (pairId, marker) =>
    request(`/pairs/${pairId}/progress`, { method: 'PUT', body: marker }),
  clearProgress: (pairId, scopeKey) =>
    request(`/pairs/${pairId}/progress/${encodeURIComponent(scopeKey)}`, { method: 'DELETE' }),
};

export { ApiError };
