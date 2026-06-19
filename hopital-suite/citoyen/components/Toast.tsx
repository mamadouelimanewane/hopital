"use client"
import { useState } from "react"
import { CheckCircle, XCircle, Info, X } from "lucide-react"

export type ToastType = "success" | "error" | "info"
export interface ToastData { id: number; message: string; type: ToastType }

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([])
  const show = (message: string, type: ToastType = "success") => {
    const id = Date.now()
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
  }
  const remove = (id: number) => setToasts(t => t.filter(x => x.id !== id))
  return { toasts, show, remove }
}

export function ToastContainer({ toasts, onRemove }: { toasts: ToastData[], onRemove: (id: number) => void }) {
  const icons = { success: CheckCircle, error: XCircle, info: Info }
  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800"
  }
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2 pointer-events-none">
      {toasts.map(t => {
        const Icon = icons[t.type]
        return (
          <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium pointer-events-auto ${colors[t.type]}`}>
            <Icon className="size-4 shrink-0" />
            <span>{t.message}</span>
            <button onClick={() => onRemove(t.id)} className="ml-2 opacity-60 hover:opacity-100"><X className="size-3.5" /></button>
          </div>
        )
      })}
    </div>
  )
}
