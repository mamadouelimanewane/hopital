import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// ── Types ──────────────────────────────────────────────
export type UserRole = 'agent' | 'chef_achats' | 'econome' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  dept: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// ── Comptes Hôpital Ndamatou Touba ─────────────────────
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: 'USR-001', name: 'Modou Ndoye', email: 'm.ndoye@ndamatou.sn',
    password: 'agent2026', role: 'agent', avatar: 'MN',
    dept: 'Logistique & Approvisionnement',
  },
  {
    id: 'USR-002', name: 'Aïda Sarr', email: 'a.sarr@ndamatou.sn',
    password: 'achats2026', role: 'chef_achats', avatar: 'AS',
    dept: 'Service Achats',
  },
  {
    id: 'USR-003', name: 'Cheikh Mbacké', email: 'c.mbacke@ndamatou.sn',
    password: 'econome2026', role: 'econome', avatar: 'CM',
    dept: 'Économat Général',
  },
  {
    id: 'USR-004', name: 'Admin Supply-Chain', email: 'admin@ndamatou.sn',
    password: 'ndamatou2026', role: 'admin', avatar: 'AS',
    dept: 'Informatique & Systèmes',
  },
];

// ── Context ────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('supplychain_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 700));
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem('supplychain_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('supplychain_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export const roleLabels: Record<UserRole, string> = {
  agent:       'Agent Logistique',
  chef_achats: 'Chef Service Achats',
  econome:     'Économe Général',
  admin:       'Administrateur',
};

export const roleColors: Record<UserRole, string> = {
  agent:       'from-cyan-500 to-blue-600',
  chef_achats: 'from-amber-500 to-yellow-600',
  econome:     'from-emerald-500 to-teal-600',
  admin:       'from-rose-500 to-orange-500',
};
