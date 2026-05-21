import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  initialize: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isInitialized: false,
  login: (token: string, user: User) => {
    localStorage.setItem('token', token);
    set({ token, user, isAuthenticated: true, isInitialized: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null, isAuthenticated: false, isInitialized: true });
  },
  setUser: (user: User) => set({ user }),
  initialize: () => set({ isInitialized: true }),
}));

export const loadUser = async (): Promise<void> => {
  const { token, initialize } = useAuth.getState();
  if (!token) {
    initialize();
    return;
  }
  try {
    const { default: apiClient } = await import('../config/apiClient');
    const response = await apiClient.get<{ profile: User }>('/users/me');
    useAuth.getState().setUser(response.data.profile);
  } catch {
    useAuth.getState().logout();
  } finally {
    useAuth.getState().initialize();
  }
};
