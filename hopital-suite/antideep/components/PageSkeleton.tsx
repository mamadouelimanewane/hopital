export function PageSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="p-4 sm:p-6 space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-white/10 rounded-xl" />
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-white/10" />
        ))}
      </div>
      <div className="h-64 rounded-2xl bg-white/10" />
    </div>
  )
}
