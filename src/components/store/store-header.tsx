'use client'

import Link from 'next/link'
import { Flame, Search, ShoppingCart, Menu, X, Headphones, FileDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/lib/store'
import type { Settings } from '@/lib/types'
import { toast } from 'sonner'

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
  const [isPopping, setIsPopping] = useState(false)

  useEffect(() => {
    if (cartCount > 0) {
      setIsPopping(true)
      const t = setTimeout(() => setIsPopping(false), 300)
      return () => clearTimeout(t)
    }
  }, [cartCount])

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop Spices', href: '/#shop' },
    { label: 'Categories', href: '/#categories' },
    { label: 'About Us', href: '/about' },
    { label: 'Why Us', href: '/#features' },
    { label: 'Contact', href: '/#contact' },
  ]

  const handleDownloadPdf = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    const pdfUrl = settings?.priceListPdf || '/Hari_Masala_Price_List.pdf'
    toast.success('Downloading Hari Masala Price List PDF...')
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = 'Hari_Masala_Price_List.pdf'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
      {/* Announcement bar */}
      {settings.announcement && (
        <div className="bg-primary-gradient text-primary-foreground text-center text-xs sm:text-sm py-2 px-4 font-medium">
          {settings.announcement}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Main header row */}
        <div className="flex h-16 items-center gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            {settings.logoImage ? (
              <img src={settings.logoImage} alt={settings.storeName} className="h-16 w-auto object-contain scale-[180%] sm:scale-[250%] origin-left" />
            ) : (
              <>
                <span className="grid place-items-center h-9 w-9 rounded-full bg-primary-gradient text-primary-foreground shadow-sm">
                  <Flame className="h-5 w-5" />
                </span>
                <span className="flex flex-col leading-none">
                  <span className="font-extrabold text-lg tracking-tight text-foreground">
                    Hari<span className="text-primary"> Masala</span>
                  </span>
                  <span className="text-[10px] text-primary hidden sm:block font-medium">
                    Pure & Authentic Spices
                  </span>
                </span>
              </>
            )}
          </Link>

          {/* Search bar (desktop, centered) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                  onSearch(e.target.value)
                }}
                placeholder="Search for spices, mukhvas, masala…"
                className="pl-9 h-10 bg-muted/50 border-border focus-visible:bg-background"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto md:ml-0">
            {/* Need Help (desktop) */}
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-accent transition-colors"
            >
              <Headphones className="h-5 w-5 text-primary" />
              <span className="flex flex-col leading-tight">
                <span className="text-xs text-muted-foreground">Need Help?</span>
                <span className="text-xs font-semibold text-primary">Support</span>
              </span>
            </a>

            {/* Search toggle (mobile) */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
              className="md:hidden h-9 w-9"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button
              variant="default"
              size="sm"
              onClick={() => setOpen(true)}
              className="relative bg-primary-gradient hover:opacity-90 h-10 px-3"
            >
              <ShoppingCart className={`h-5 w-5 sm:mr-1.5 transition-transform duration-200 ${isPopping ? 'scale-125' : ''}`} />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className={`absolute -top-1.5 -right-1.5 grid place-items-center min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[11px] font-bold border-2 border-white transition-transform duration-300 ${isPopping ? 'scale-125' : 'scale-100'}`}>
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Hamburger (mobile) */}
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

        {/* Search bar (mobile, collapsible) */}
        {searchOpen && (
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                autoFocus
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                  onSearch(e.target.value)
                }}
                placeholder="Search spices, mukhvas…"
                className="pl-9 h-10"
              />
            </div>
          </div>
        )}

        {/* Nav row (desktop) */}
        <nav className="hidden md:flex items-center gap-1 h-11 -mt-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent/60 rounded-md transition-colors"
            >
              {l.label}
            </Link>
          ))}
          {/* PDF Download Button in Desktop Menu */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50/90 hover:bg-amber-100 hover:text-amber-900 border border-amber-300/80 rounded-md transition-all shadow-xs cursor-pointer active:scale-95"
            title="Download Hari Masala Price List (PDF)"
          >
            <FileDown className="h-3.5 w-3.5 text-amber-600" />
            <span>Price List (PDF)</span>
          </button>
          <span className="ml-auto text-xs text-muted-foreground">
            Order on WhatsApp
          </span>
        </nav>
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <nav className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-1 shadow-lg">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/60 rounded-md"
            >
              {l.label}
            </Link>
          ))}

          {/* PDF Download Option below all menus */}
          <div className="pt-2.5 mt-1.5 border-t border-border">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                handleDownloadPdf()
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-bold text-amber-950 bg-gradient-to-r from-amber-50 to-amber-100/90 hover:from-amber-100 hover:to-amber-200/90 rounded-lg border border-amber-300/80 transition-all shadow-xs active:scale-[0.99] cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <FileDown className="h-4 w-4 text-amber-700 shrink-0" />
                <span>Download Price List (PDF)</span>
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full border border-amber-300/60">
                PDF
              </span>
            </button>
          </div>
        </nav>
      )}
    </header>
  )
}
