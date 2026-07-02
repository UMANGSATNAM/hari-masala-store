'use client'

import { useState } from 'react'
import {
  LayoutDashboard, Package, ShoppingCart, Settings as SettingsIcon,
  LogOut, Store, Flame, Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAdmin } from '@/lib/store'
import { AdminDashboard } from './admin-dashboard'
import { AdminProducts } from './admin-products'
import { AdminOrders } from './admin-orders'
import { AdminSettings } from './admin-settings'
import type { Category, Settings } from '@/lib/types'

type Tab = 'dashboard' | 'products' | 'orders' | 'settings'

const NAV: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
]

export function AdminApp({
  settings,
  categories,
  onExit,
  onSettingsSaved,
}: {
  settings: Settings
  categories: Category[]
  onExit: () => void
  onSettingsSaved: (s: Settings) => void
}) {
  const logout = useAdmin((s) => s.logout)
  const [tab, setTab] = useState<Tab>('dashboard')
  const [mobileNav, setMobileNav] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-card">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              className="md:hidden p-1.5 -ml-1.5"
              onClick={() => setMobileNav((v) => !v)}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="grid place-items-center h-8 w-8 rounded-full bg-spice-gradient text-primary-foreground">
              <Flame className="h-4 w-4" />
            </span>
            <span className="font-bold text-foreground hidden sm:inline">Hari Masala</span>
            <span className="text-xs text-muted-foreground bg-accent px-2 py-0.5 rounded-full hidden sm:inline">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onExit} className="h-8">
              <Store className="h-4 w-4 mr-1.5" /> <span className="hidden sm:inline">View Store</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { logout(); onExit() }} className="h-8 text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block w-60 shrink-0 border-r border-border bg-card">
          <nav className="p-3 space-y-1 sticky top-14">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  tab === n.id
                    ? 'bg-spice-gradient text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <n.icon className="h-4 w-4" /> {n.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile nav drawer */}
        {mobileNav && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setMobileNav(false)}>
            <div
              className="absolute left-0 top-14 bottom-0 w-64 bg-card border-r border-border p-3 space-y-1"
              onClick={(e) => e.stopPropagation()}
            >
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => { setTab(n.id); setMobileNav(false) }}
                  className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    tab === n.id
                      ? 'bg-spice-gradient text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <n.icon className="h-4 w-4" /> {n.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          <div className="mx-auto max-w-6xl">
            {tab === 'dashboard' && <AdminDashboard onGoOrders={() => setTab('orders')} />}
            {tab === 'products' && <AdminProducts categories={categories} />}
            {tab === 'orders' && <AdminOrders settings={settings} />}
            {tab === 'settings' && <AdminSettings settings={settings} onSaved={onSettingsSaved} />}
          </div>
        </main>
      </div>
    </div>
  )
}
