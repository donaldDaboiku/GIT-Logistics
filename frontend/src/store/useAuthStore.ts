import { create } from 'zustand';
import type { AuthUser } from '../types';
import { apiErrorMessage } from '../api/errors';
import {
  fetchCurrentUser,
  login as apiLogin,
  logout as apiLogout,
  readStoredUser,
} from '../api/auth';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: readStoredUser(),
  token: localStorage.getItem('git_auth_token'),
  isLoading: false,
  error: null,

  hydrate: async () => {
    const token = localStorage.getItem('git_auth_token');
    if (!token) {
      set({ user: null, token: null });
      return;
    }
    const user = await fetchCurrentUser();
    set({ user, token: user ? token : null });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await apiLogin({ email, password });
      set({ user, token, isLoading: false, error: null });
    } catch (err: unknown) {
      const msg = apiErrorMessage(err, 'Login failed. Check your email and password.');
      set({ isLoading: false, error: msg });
      throw err;
    }
  },

  logout: async () => {
    await apiLogout();
    set({ user: null, token: null, error: null });
  },
}));
