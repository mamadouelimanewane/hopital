"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { GraduationCap, BarChart2, BookOpen, Video, HelpCircle, Award, School, FileText, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

const groups = [
  {
    label: "Vue d'ensemble",
    items: [
      { name: "Tableau de bord", href: "/dashboard", icon: BarChart2 },
      { name: "Établissements", href: "/etablissements", icon: School },
    ],
  },
  {
    label: "Contenus pédagogiques",
    items: [
      { name: "Ressources", href: "/ressources", icon: BookOpen },
      { name: "Modules", href: "/modules", icon: Video },
      { name: "Formations", href: "/formations", icon: Users },
    ],
  },
  {
    label: "Évaluation",
    items: [
      { name: "Quiz & Évaluations", href: "/quiz", icon: HelpCircle },
      { name: "Certificats", href: "/certificats", icon: Award },
    ],
  },
  {
    label: "Pilotage",
    items: [
      { name: "Rapports", href: "/rapports", icon: FileText },
    ],
  },
]

interface SidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside className={cn(
        "flex flex-col h-screen bg-slate-950 text-white transition-all duration-300 shrink-0 border-r border-white/5",
        "fixed inset-y-0 left-0 z-50 lg:static",
        "w-72 lg:w-auto",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        collapsed ? "lg:w-16" : "lg:w-64"
      )}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
            <GraduationCap className="size-5 text-emerald-400" />
          </div>
          {!collapsed && (
            <div>
              <p className="font-black text-sm text-white leading-tight">CNRA</p>
              <p className="text-[10px] text-emerald-400 font-bold leading-tight tracking-wide">EDUMEDIA</p>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="ml-auto p-1 rounded hover:bg-white/10 transition-colors">
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>
        </div>

        {!collapsed && (
          <div className="mx-4 mt-3 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-400 font-bold">PLATEFORME ACTIVE</span>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {groups.map(g => (
            <div key={g.label} className="mb-4">
              {!collapsed && (
                <p className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest px-3 mb-1">{g.label}</p>
              )}
              {g.items.map(item => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link key={item.href} href={item.href} title={collapsed ? item.name : undefined}
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5",
                      isActive ? "bg-emerald-500/20 text-emerald-400" : "text-gray-400 hover:bg-white/5 hover:text-white"
                    )}>
                    <item.icon className={cn("shrink-0", collapsed ? "size-5 mx-auto" : "size-4")} />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {!collapsed && (
          <div className="p-4 border-t border-white/10">
            <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
              <p className="text-xs text-emerald-400 font-bold mb-1">CNRA EduMedia v1.0</p>
              <p className="text-[10px] text-gray-500 leading-relaxed">Éducation aux médias et littératie médiatique au Sénégal</p>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
