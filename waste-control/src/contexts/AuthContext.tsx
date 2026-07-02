import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// ── Types ──────────────────────────────────────────────
export type UserRole = 'agent' | 'superviseur' | 'hygieniste' | 'admin';

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
    id: 'USR-001', name: 'Moussa Ndao', email: 'm.ndao@ndamatou.sn',
    password: 'agent2026', role: 'agent', avatar: 'MN',
    dept: 'Collecte des Déchets',
  },
  {
    id: 'USR-002', name: 'Aïssatou Ba', email: 'a.ba@ndamatou.sn',
    password: 'super2026', role: 'superviseur', avatar: 'AB',
    dept: 'Supervision Environnementale',
  },
  {
    id: 'USR-003', name: 'Dr. Cheikh Gueye', email: 'c.gueye@ndamatou.sn',
    password: 'hyg2026', role: 'hygieniste', avatar: 'CG',
    dept: 'Hygiène Hospitalière',
  },
  {
    id: 'USR-004', name: 'Admin Waste-Control', email: 'admin@ndamatou.sn',
    password: 'ndamatou2026', role: 'admin', avatar: 'AW',
    dept: 'Informatique & Systèmes',
  },
];

// ── Context ────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('wc_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 700));
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _password, ...userData } = found;
      setUser(userData);
      localStorage.setItem('wc_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wc_user');
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
  agent:        'Agent de Collecte',
  superviseur:  'Superviseur Environnemental',
  hygieniste:   'Hygiéniste Hospitalier',
  admin:        'Administrateur',
};

export const roleColors: Record<UserRole, string> = {
  agent:       'from-lime-500 to-green-600',
  superviseur: 'from-cyan-500 to-blue-600',
  hygieniste:  'from-emerald-500 to-teal-600',
  admin:       'from-rose-500 to-orange-500',
};
