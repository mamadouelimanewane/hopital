"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Vote,
  Users,
  Radio,
  Mic2,
  Bell,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Eye,
  Gavel,
  MessageSquare,
  Shield,
  Zap,
  Sparkles,
} from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const navigation = [
  { name: "Tableau de bord",   href: "/dashboard",        icon: LayoutDashboard, group: "principal" },
  { name: "Vue Directeur",     href: "/directeur",        icon: Shield,          group: "principal" },
  { name: "Salle de Crise",    href: "/salle-de-crise",   icon: Zap,             group: "principal" },
  { name: "IA Assistant",      href: "/ia-assistant",     icon: Sparkles,        group: "principal" },
  { name: "Campagnes",         href: "/campagnes",      icon: Vote,            group: "monitoring" },
  { name: "Interventions",     href: "/interventions",  icon: Mic2,            group: "monitoring" },
  { name: "Partis politiques", href: "/partis",         icon: Users,           group: "monitoring" },
  { name: "Médias",            href: "/medias",         icon: Radio,           group: "monitoring" },
  { name: "Alertes",           href: "/alertes",        icon: Bell,            group: "regulation" },
  { name: "Sanctions",         href: "/sanctions",      icon: Gavel,           group: "regulation" },
  { name: "Signalements",      href: "/signalements",   icon: MessageSquare,   group: "regulation" },
  { name: "Rapports",          href: "/rapports",       icon: FileText,        group: "regulation" },
  { name: "Observatoire public", href: "/public/observatoire", icon: Eye,     group: "public" },
]

const groups = [
  { key: "principal", label: "Principal" },
  { key: "monitoring", label: "Monitoring" },
  { key: "regulation", label: "Régulation" },
  { key: "public", label: "Public" },
]

interface SidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={cn(
          "flex flex-col h-screen bg-[#1A3A6B] text-white transition-all duration-300 shrink-0",
          "fixed inset-y-0 left-0 z-50 lg:static",
          "w-72 lg:w-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "lg:w-16" : "lg:w-64"
        )}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 shrink-0">
            <Vote className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="font-bold text-sm leading-tight">CNRA</p>
              <p className="text-[11px] text-blue-200 font-medium leading-tight">ElectroWatch</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto p-1 rounded hover:bg-white/10 transition-colors"
            title={collapsed ? "Développer" : "Réduire"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {groups.map(group => {
            const items = navigation.filter(n => n.group === group.key)
            return (
              <div key={group.key} className="mb-3">
                {!collapsed && (
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider px-3 mb-1">{group.label}</p>
                )}
                {items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"))
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.name : undefined}
                      onClick={onMobileClose}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-white/20 text-white"
                          : "text-blue-100 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <item.icon className={cn("shrink-0", collapsed ? "w-5 h-5 mx-auto" : "w-4 h-4")} />
                      {!collapsed && <span>{item.name}</span>}
                    </Link>
                  )
                })}
              </div>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-2">
          <button
            onClick={handleLogout}
            title={collapsed ? "Déconnexion" : undefined}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-blue-200 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className={cn("shrink-0", collapsed ? "w-5 h-5 mx-auto" : "w-4 h-4")} />
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
