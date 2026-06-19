"use client"

import { useState } from "react"
import { Sidebar } from "@/components/Sidebar"
import { Menu, Shield } from "lucide-react"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barre mobile */}
        <div className="lg:hidden flex items-center gap-3 px-4 h-14 bg-gray-900 border-b border-white/10 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
          >
            <Menu className="size-5" />
          </button>
          <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Shield className="size-4 text-purple-400" />
          </div>
          <div>
            <p className="text-white font-black text-xs leading-tight">CNRA</p>
            <p className="text-purple-400 text-[10px] font-bold leading-tight">ANTIDEEP</p>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto bg-gray-950">
          {children}
        </main>
      </div>
    </div>
  )
}
