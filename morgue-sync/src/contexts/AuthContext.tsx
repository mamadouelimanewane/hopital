import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// ── Types ──────────────────────────────────────────────
export type UserRole = 'agent' | 'responsable' | 'medecin' | 'admin';

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
    id: 'USR-001', name: 'Cheikh Anta Mbaye', email: 'c.mbaye@ndamatou.sn',
    password: 'agent2026', role: 'agent', avatar: 'CM',
    dept: 'Service Mortuaire',
  },
  {
    id: 'USR-002', name: 'Aïssatou Ndoye', email: 'a.ndoye@ndamatou.sn',
    password: 'resp2026', role: 'responsable', avatar: 'AN',
    dept: 'Administration Funéraire',
  },
  {
    id: 'USR-003', name: 'Dr. Serigne Kane', email: 's.kane@ndamatou.sn',
    password: 'med2026', role: 'medecin', avatar: 'SK',
    dept: 'Médecine Légale',
  },
  {
    id: 'USR-004', name: 'Admin Morgue-Sync', email: 'admin@ndamatou.sn',
    password: 'ndamatou2026', role: 'admin', avatar: 'AM',
    dept: 'Informatique & Systèmes',
  },
];

// ── Context ────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('morguesync_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 700));
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem('morguesync_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('morguesync_user');
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
  agent:        'Agent Mortuaire',
  responsable:  'Responsable Administratif',
  medecin:      'Médecin Légiste',
  admin:        'Administrateur',
};

export const roleColors: Record<UserRole, string> = {
  agent:        'from-slate-500 to-slate-600',
  responsable:  'from-blue-500 to-slate-600',
  medecin:      'from-teal-500 to-slate-600',
  admin:        'from-indigo-500 to-slate-600',
};
