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

// ── Notifications initiales ─────────────────────────────────────────────────

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'N001', type: 'info', read: false, ts: new Date(Date.now() - 3600000),
    title: 'Nouveau dossier enregistré',
    message: 'Un nouveau défunt a été admis au service et enregistré dans le registre.',
  },
  {
    id: 'N002', type: 'warning', read: false, ts: new Date(Date.now() - 7200000),
    title: 'Démarche en attente',
    message: 'Un certificat de décès est en attente de traitement depuis plus de 24h.',
  },
  {
    id: 'N003', type: 'success', read: true, ts: new Date(Date.now() - 18000000),
    title: 'Démarche finalisée',
    message: "L'autorisation d'inhumation a été émise et transmise à la famille.",
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
