import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

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

// ── Initial seeded alerts ──────────────────────────────────────────────────

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'N001', type: 'error', read: false, ts: new Date(Date.now() - 1800000),
    title: 'Container plein — Bloc Opératoire 2',
    message: 'Le container DASRI Piquant-Coupant a atteint 92% de remplissage. Vidage requis en urgence.',
  },
  {
    id: 'N002', type: 'warning', read: false, ts: new Date(Date.now() - 5400000),
    title: 'Collecte en attente — Laboratoire',
    message: '3 collectes DASRI Infectieux sont en attente depuis plus de 24h.',
  },
  {
    id: 'N003', type: 'success', read: true, ts: new Date(Date.now() - 10800000),
    title: 'Incinération terminée — Lot INC-2026-014',
    message: 'Certificat de destruction généré. Poids total détruit : 128,4 kg.',
  },
  {
    id: 'N004', type: 'info', read: true, ts: new Date(Date.now() - 86400000),
    title: 'Rapport de conformité disponible',
    message: 'Le rapport mensuel de conformité DASRI de juin 2026 est disponible.',
  },
];

// ── Toast styles ────────────────────────────────────────────────────────────

const toastIcons: Record<NotifType, React.ElementType> = {
  success: CheckCircle2, warning: AlertTriangle, error: XCircle, info: Info,
};

const toastStyles: Record<NotifType, string> = {
  success: 'border-emerald-500/40 bg-emerald-950/80',
  warning: 'border-amber-500/40 bg-amber-950/80',
  error:   'border-rose-500/40 bg-rose-950/80',
  info:    'border-blue-500/40 bg-blue-950/80',
};

export const toastIconColors: Record<NotifType, string> = {
  success: 'text-emerald-400', warning: 'text-amber-400', error: 'text-rose-400', info: 'text-blue-400',
};

interface ToastItem { id: string; notif: Notification }

// ── Context ────────────────────────────────────────────────────────────────

const NotifContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(SEED_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((n: Omit<Notification, 'id' | 'ts' | 'read'>) => {
    const id = `N${Date.now()}`;
    const notif: Notification = { ...n, id, ts: new Date(), read: false };
    setNotifications(prev => [notif, ...prev]);
    setToasts(prev => [...prev, { id, notif }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => setToasts(prev => prev.slice(1)), 5000);
    return () => clearTimeout(timer);
  }, [toasts]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotifContext.Provider value={{ notifications, unreadCount, push, markAllRead, dismiss }}>
      {children}

      {/* Toast Portal */}
      <div className="fixed bottom-5 right-5 z-[200] space-y-2 pointer-events-none">
        {toasts.slice(-3).map(({ id, notif }) => {
          const Icon = toastIcons[notif.type];
          return (
            <div
              key={id}
              className={`flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-xl shadow-2xl w-80 pointer-events-auto animate-fade-in-up ${toastStyles[notif.type]}`}
            >
              <Icon size={16} className={`${toastIconColors[notif.type]} shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{notif.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
              </div>
              <button
                onClick={() => setToasts(prev => prev.filter(t => t.id !== id))}
                className="text-slate-500 hover:text-white transition-colors shrink-0"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </NotifContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotifContext);
  if (!ctx) throw new Error('useNotifications must be inside NotificationProvider');
  return ctx;
}
