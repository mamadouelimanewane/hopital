import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// ── Types ──────────────────────────────────────────────
export type UserRole = 'agent' | 'securite' | 'accueil' | 'admin';

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
    id: 'USR-001', name: 'Cheikh Ahmadou Bâ', email: 'c.ba@ndamatou.sn',
    password: 'guide2026', role: 'agent', avatar: 'CB',
    dept: 'Guidage & Orientation',
  },
  {
    id: 'USR-002', name: 'Fatoumata Ndao', email: 'f.ndao@ndamatou.sn',
    password: 'accueil2026', role: 'accueil', avatar: 'FN',
    dept: "Accueil des Visiteurs",
  },
  {
    id: 'USR-003', name: 'Moussa Sarr', email: 'm.sarr@ndamatou.sn',
    password: 'secu2026', role: 'securite', avatar: 'MS',
    dept: 'Sécurité & Badges',
  },
  {
    id: 'USR-004', name: 'Admin Indoor-Guide', email: 'admin@ndamatou.sn',
    password: 'ndamatou2026', role: 'admin', avatar: 'AI',
    dept: 'Informatique & Systèmes',
  },
];

// ── Context ────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('ig_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 700));
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem('ig_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ig_user');
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
  agent:     'Agent de Guidage',
  accueil:   'Agent Accueil',
  securite:  'Agent Sécurité',
  admin:     'Administrateur',
};

export const roleColors: Record<UserRole, string> = {
  agent:    'from-blue-500 to-cyan-600',
  accueil:  'from-emerald-500 to-teal-600',
  securite: 'from-amber-500 to-orange-600',
  admin:    'from-rose-500 to-orange-500',
};
