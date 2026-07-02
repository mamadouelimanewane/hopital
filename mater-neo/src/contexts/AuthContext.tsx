import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// ── Types ──────────────────────────────────────────────
export type UserRole = 'sage-femme' | 'gynecologue' | 'pediatre' | 'admin';

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

// ── Comptes Hôpital Ndamatou Touba — Maternité & Néonatologie ──
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: 'USR-001', name: 'Aïssatou Ndoye', email: 'a.ndoye@ndamatou.sn',
    password: 'sf2026', role: 'sage-femme', avatar: 'AN',
    dept: 'Maternité — Salle de Naissance',
  },
  {
    id: 'USR-002', name: 'Dr. Fatoumata Sarr', email: 'f.sarr@ndamatou.sn',
    password: 'gyn2026', role: 'gynecologue', avatar: 'FS',
    dept: 'Gynécologie-Obstétrique',
  },
  {
    id: 'USR-003', name: 'Dr. Cheikh Anta Mbaye', email: 'c.mbaye@ndamatou.sn',
    password: 'ped2026', role: 'pediatre', avatar: 'CM',
    dept: 'Néonatologie',
  },
  {
    id: 'USR-004', name: 'Admin Mater-Neo', email: 'admin@ndamatou.sn',
    password: 'ndamatou2026', role: 'admin', avatar: 'AM',
    dept: 'Informatique & Systèmes',
  },
];

// ── Context ────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('materneo_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 700));
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem('materneo_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('materneo_user');
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
  'sage-femme':  'Sage-Femme',
  'gynecologue': 'Gynécologue-Obstétricien(ne)',
  'pediatre':    'Pédiatre Néonatologue',
  'admin':       'Administrateur',
};

export const roleColors: Record<UserRole, string> = {
  'sage-femme':  'from-pink-500 to-rose-600',
  'gynecologue': 'from-fuchsia-500 to-pink-600',
  'pediatre':    'from-cyan-500 to-blue-600',
  'admin':       'from-violet-500 to-purple-600',
};
