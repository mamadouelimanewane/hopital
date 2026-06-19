"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Menu, Vote } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="lg:hidden flex items-center gap-3 px-4 h-14 bg-[#1A3A6B] border-b border-white/10 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
          >
            <Menu className="size-5" />
          </button>
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
            <Vote className="size-4 text-white" />
          </div>
          <div>
            <p className="text-white font-black text-xs leading-tight">CNRA</p>
            <p className="text-blue-200 text-[10px] font-bold leading-tight">ELECTROWATCH</p>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
