'use client'

import { Flame, Search, ShoppingCart, Menu, X, Phone } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/lib/store'
import type { Settings } from '@/lib/types'

export function StoreHeader({
  settings,
  onSearch,
}: {
  settings: Settings
  onSearch: (q: string) => void
}) {
  const cartCount = useCart((s) => s.count())
  const setOpen = useCart((s) => s.setOpen)
  const [searchOpen, setSearchOpen] = useState(false)
  const [q, setQ] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Shop', href: '#shop' },
    { label: 'Categories', href: '#categories' },
    { label: 'Why Us', href: '#features' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <header className="sticky top-0 z-40">
      {/* Announcement bar */}
      {settings.announcement && (
        <div className="bg-spice-gradient text-primary-foreground text-center text-xs sm:text-sm py-2 px-4 font-medium">
          {settings.announcement}
        </div>
      )}

      <div className="bg-card/95 backdrop-blur border-b border-border shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-3">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-2 shrink-0">
              <span className="grid place-items-center h-9 w-9 rounded-full bg-spice-gradient text-primary-foreground shadow-sm">
                <Flame className="h-5 w-5" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-extrabold text-lg tracking-tight text-foreground">
                  Hari<span className="text-primary"> Masala</span>
                </span>
                <span className="text-[10px] text-muted-foreground hidden sm:block">
                  Pure & Authentic Spices
                </span>
              </span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Search"
                onClick={() => setSearchOpen((v) => !v)}
                className="h-9 w-9"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setOpen(true)}
                className="relative bg-spice-gradient hover:opacity-90 h-9 px-3"
              >
                <ShoppingCart className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 grid place-items-center min-w-5 h-5 px-1 rounded-full bg-foreground text-background text-[11px] font-bold">
                    {cartCount}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Menu"
                className="md:hidden h-9 w-9"
                onClick={() => setMenuOpen((v) => !v)}
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  autoFocus
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value)
                    onSearch(e.target.value)
                  }}
                  placeholder="Search for turmeric, chili, garam masala…"
                  className="pl-9 h-10"
                />
              </div>
            </div>
          )}

          {/* Mobile nav */}
          {menuOpen && (
            <nav className="md:hidden pb-3 flex flex-col gap-1">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent/50 rounded-md"
                >
                  {l.label}
                </a>
              ))}
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 text-sm font-medium text-green-700 flex items-center gap-2"
              >
                <Phone className="h-4 w-4" /> {settings.whatsappNumber}
              </a>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}
