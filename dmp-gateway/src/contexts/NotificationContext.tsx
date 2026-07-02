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
  markAllRead: () => void;
  dismiss: (id: string) => void;
}

// ── Alertes initiales ────────────────────────────────────────────────────

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'N001', type: 'error', read: false, ts: new Date(Date.now() - 1800000),
    title: 'Connecteur en erreur — CHU Le Dantec',
    message: 'Le connecteur FHIR R4 vers le CHU Aristide Le Dantec est en erreur depuis 15 min.',
  },
  {
    id: 'N002', type: 'warning', read: false, ts: new Date(Date.now() - 5400000),
    title: 'Latence élevée détectée',
    message: 'Le connecteur HL7 v2 vers l\'Hôpital Régional de Thiès affiche une latence > 800ms.',
  },
  {
    id: 'N003', type: 'success', read: true, ts: new Date(Date.now() - 10800000),
    title: 'Synchronisation réussie',
    message: '128 dossiers patients synchronisés avec le réseau national de santé.',
  },
  {
    id: 'N004', type: 'info', read: true, ts: new Date(Date.now() - 86400000),
    title: 'Nouveau connecteur actif',
    message: 'Le connecteur vers l\'Hôpital de Ziguinchor a été activé avec succès.',
  },
];

// ── Context ────────────────────────────────────────────────────────────────

const NotifContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(SEED_NOTIFICATIONS);

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotifContext.Provider value={{ notifications, unreadCount, markAllRead, dismiss }}>
      {children}
    </NotifContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotifContext);
  if (!ctx) throw new Error('useNotifications must be inside NotificationProvider');
  return ctx;
}
