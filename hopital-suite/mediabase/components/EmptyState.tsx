import { LucideIcon } from "lucide-react"

export function EmptyState({ icon: Icon, title, description, action }: {
  icon: LucideIcon; title: string; description: string; action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
        <Icon className="size-7 text-gray-300" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-sm text-gray-400 max-w-xs">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
