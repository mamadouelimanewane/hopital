import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

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
  addNotification: (n: Omit<Notification, 'id' | 'ts' | 'read'>) => void;
}

const initialNotifications: Notification[] = [
  { id: 'N-001', type: 'info', title: 'Nouveau visiteur', message: "Awa Diagne enregistrée pour Cardiologie", ts: new Date(Date.now() - 5 * 60000), read: false },
  { id: 'N-002', type: 'warning', title: 'Badge non retourné', message: 'Le badge B-1042 est en retard de restitution', ts: new Date(Date.now() - 45 * 60000), read: false },
  { id: 'N-003', type: 'success', title: 'Itinéraire généré', message: 'Guidage vers Maternité créé avec succès', ts: new Date(Date.now() - 120 * 60000), read: true },
];

export const toastIconColors: Record<NotifType, string> = {
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  error:   'text-rose-400',
  info:    'text-blue-400',
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addNotification = (n: Omit<Notification, 'id' | 'ts' | 'read'>) => {
    setNotifications(prev => [{ ...n, id: `N-${Date.now()}`, ts: new Date(), read: false }, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, dismiss, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
}
