import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

export type NotifType = 'success' | 'warning' | 'error' | 'info';

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  ts: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  push: (n: Omit<Notification, 'id' | 'ts' | 'read'>) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
}

// ── Alertes initiales — Maternité & Néonatologie ────────────────────────────

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'N001', type: 'error', read: false, ts: new Date(Date.now() - 1800000),
    title: 'Couveuse 04 — Alerte température',
    message: 'Température hors seuil détectée. Vérification technique requise en Néonatologie.',
  },
  {
    id: 'N002', type: 'warning', read: false, ts: new Date(Date.now() - 5400000),
    title: 'Grossesse à risque élevé',
    message: 'Mme Aminata Diagne (39 SA) — pré-éclampsie suspectée. Consultation urgente recommandée.',
  },
  {
    id: 'N003', type: 'info', read: false, ts: new Date(Date.now() - 9000000),
    title: 'Accouchement enregistré',
    message: 'Naissance par voie basse — Mme Sokhna Fall. Nouveau-né en bonne santé (Apgar 9/10).',
  },
  {
    id: 'N004', type: 'success', read: true, ts: new Date(Date.now() - 43200000),
    title: 'Lits Néonat. disponibles',
    message: '5 couveuses libres sur 15. Capacité d\'accueil suffisante.',
  },
];

// ── Context ────────────────────────────────────────────────────────────────

const NotifContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(SEED_NOTIFICATIONS);

  const push = useCallback((n: Omit<Notification, 'id' | 'ts' | 'read'>) => {
    const id = `N${Date.now()}`;
    const notif: Notification = { ...n, id, ts: new Date(), read: false };
    setNotifications(prev => [notif, ...prev]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotifContext.Provider value={{ notifications, unreadCount, push, markAllRead, dismiss }}>
      {children}
    </NotifContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotifContext);
  if (!ctx) throw new Error('useNotifications must be inside NotificationProvider');
  return ctx;
}

export const toastIconColors: Record<NotifType, string> = {
  success: 'text-emerald-400', warning: 'text-amber-400', error: 'text-rose-400', info: 'text-blue-400',
};
