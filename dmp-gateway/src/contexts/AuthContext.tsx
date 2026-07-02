import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// ── Types ──────────────────────────────────────────────
export type UserRole = 'admin' | 'medecin' | 'dim' | 'referent';

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
    id: 'USR-001', name: 'Dr. Cheikh Anta Mbaye', email: 'c.mbaye@ndamatou.sn',
    password: 'dmp2026', role: 'medecin', avatar: 'CM',
    dept: 'Médecine Interne',
  },
  {
    id: 'USR-002', name: 'Aïssatou Kane', email: 'a.kane@ndamatou.sn',
    password: 'dim2026', role: 'dim', avatar: 'AK',
    dept: "Département d'Information Médicale",
  },
  {
    id: 'USR-003', name: 'Moussa Sarr', email: 'm.sarr@ndamatou.sn',
    password: 'ref2026', role: 'referent', avatar: 'MS',
    dept: 'Référent Interopérabilité Réseau',
  },
  {
    id: 'USR-004', name: 'Admin DMP-Gateway', email: 'admin@ndamatou.sn',
    password: 'ndamatou2026', role: 'admin', avatar: 'AG',
    dept: 'Informatique & Systèmes',
  },
];

// ── Context ────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('dmp_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 700));
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem('dmp_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dmp_user');
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
  admin:    'Administrateur',
  medecin:  'Médecin',
  dim:      "Département d'Information Médicale",
  referent: 'Référent Interopérabilité',
};

export const roleColors: Record<UserRole, string> = {
  admin:    'from-rose-500 to-orange-500',
  medecin:  'from-emerald-500 to-teal-600',
  dim:      'from-cyan-500 to-blue-600',
  referent: 'from-violet-500 to-indigo-600',
};
