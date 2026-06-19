"use client"

import { useState } from "react"
import { Sidebar } from "@/components/Sidebar"
import { Menu, Database } from "lucide-react"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a1628]">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="lg:hidden flex items-center gap-3 px-4 h-14 bg-[#0f1f3d] border-b border-white/10 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
          >
            <Menu className="size-5" />
          </button>
          <div className="w-7 h-7 rounded-lg bg-[#C9A84C]/20 flex items-center justify-center">
            <Database className="size-4 text-[#C9A84C]" />
          </div>
          <div>
            <p className="text-white font-black text-xs leading-tight">CNRA</p>
            <p className="text-[#C9A84C] text-[10px] font-bold leading-tight">MEDIABASE</p>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
