import client, { USE_LOCAL_STORAGE } from './client';
import type { AuthUser, LoginPayload } from '../types';

const USER_KEY = 'git_auth_user';
const TOKEN_KEY = 'git_auth_token';

export function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function persistSession(user: AuthUser, token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function login(payload: LoginPayload): Promise<{ user: AuthUser; token: string }> {
  if (USE_LOCAL_STORAGE) {
    const user: AuthUser = { id: 1, name: 'Demo Ops User', email: payload.email, role: 'ops' };
    const token = 'demo-local-token';
    persistSession(user, token);
    return { user, token };
  }
  const { data } = await client.post<{ user: AuthUser; token: string }>('/auth/login', payload);
  persistSession(data.user, data.token);
  return data;
}

export async function logout(): Promise<void> {
  if (!USE_LOCAL_STORAGE) {
    try {
      await client.post('/auth/logout');
    } catch {
      /* token may already be invalid */
    }
  }
  clearSession();
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  if (USE_LOCAL_STORAGE) return readStoredUser();
  try {
    const { data } = await client.get<{ data: AuthUser }>('/auth/me');
    localStorage.setItem(USER_KEY, JSON.stringify(data.data));
    return data.data;
  } catch {
    clearSession();
    return null;
  }
}
