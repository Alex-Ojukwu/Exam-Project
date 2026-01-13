import { create } from 'zustand';

export type UserRole = 'manager' | 'cashier';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

// Dummy users for testing - replace with actual API calls later
export const DUMMY_USERS = [
  {
    id: '1',
    username: 'manager',
    password: 'Manager@123',
    role: 'manager' as UserRole,
    name: 'John Manager',
  },
  {
    id: '2',
    username: 'cashier',
    password: 'Cashier@123',
    role: 'cashier' as UserRole,
    name: 'Jane Cashier',
  },
];

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => { success: boolean; role?: UserRole; error?: string };
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (username: string, password: string) => {
    const foundUser = DUMMY_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      set({ user: userWithoutPassword, isAuthenticated: true });
      return { success: true, role: foundUser.role };
    }

    return { success: false, error: 'Invalid username or password' };
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
