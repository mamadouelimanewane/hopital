export function PageSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="p-4 sm:p-6 space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-gray-200 rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: Math.min(rows, 6) }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-gray-100" />
        ))}
      </div>
      <div className="h-64 rounded-2xl bg-gray-100" />
    </div>
  )
}
