import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// ── Types ──────────────────────────────────────────────
export type UserRole = 'nephrologue' | 'infirmier' | 'technicien' | 'admin';

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

// ── Comptes Hôpital Ndamatou Touba — Centre d'Hémodialyse ──
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: 'USR-001', name: 'Dr. Cheikh Ahmadou Bamba Mbacké', email: 'ca.mbacke@ndamatou.sn',
    password: 'nephro2026', role: 'nephrologue', avatar: 'CM',
    dept: 'Néphrologie',
  },
  {
    id: 'USR-002', name: 'Aïda Ndoye', email: 'a.ndoye@ndamatou.sn',
    password: 'inf2026', role: 'infirmier', avatar: 'AN',
    dept: 'Soins Infirmiers — Hémodialyse',
  },
  {
    id: 'USR-003', name: 'Modou Fall', email: 'm.fall@ndamatou.sn',
    password: 'tech2026', role: 'technicien', avatar: 'MF',
    dept: 'Maintenance Biomédicale',
  },
  {
    id: 'USR-004', name: 'Admin Hemo-Care', email: 'admin@ndamatou.sn',
    password: 'ndamatou2026', role: 'admin', avatar: 'AH',
    dept: 'Informatique & Systèmes',
  },
];

// ── Context ────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('hemocare_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 700));
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem('hemocare_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hemocare_user');
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
  nephrologue: 'Néphrologue',
  infirmier:   'Infirmier(ère)',
  technicien:  'Technicien Biomédical',
  admin:       'Administrateur',
};

export const roleColors: Record<UserRole, string> = {
  nephrologue: 'from-sky-500 to-blue-600',
  infirmier:   'from-emerald-500 to-teal-600',
  technicien:  'from-violet-500 to-indigo-600',
  admin:       'from-rose-500 to-orange-500',
};
