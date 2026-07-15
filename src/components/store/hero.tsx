'use client'

import { ShoppingBag, Leaf, Truck, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Settings } from '@/lib/types'

export function Hero({ settings }: { settings: Settings }) {
  return (
    <section id="home" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome line */}
        <div className="mb-5 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
            Welcome to <span className="text-primary">{settings.storeName}</span>
          </h1>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground">
            {settings.storeTagline}. Order on WhatsApp, pay cash on delivery.
          </p>
        </div>

        {/* Side-by-side banner cards (like reference) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Saffron banner */}
          <div className="relative overflow-hidden rounded-2xl bg-saffron-gradient p-6 sm:p-8 min-h-[200px] sm:min-h-[240px] flex flex-col justify-center">
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/15" />
            <div className="absolute -right-10 top-10 h-24 w-24 rounded-full bg-white/10" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/25 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
                <Leaf className="h-3 w-3" /> Bestseller
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white leading-tight max-w-xs">
                Authentic Indian Spices
              </h2>
              <p className="mt-1.5 text-sm text-white/90 max-w-xs">
                Pure, freshly ground masalas & whole spices from Unjha.
              </p>
              <Button
                asChild
                size="sm"
                className="mt-4 bg-primary-gradient hover:opacity-90 text-primary-foreground h-9"
              >
                <a href="#shop">
                  <ShoppingBag className="h-4 w-4 mr-1.5" /> Shop Spices
                </a>
              </Button>
            </div>
          </div>

          {/* Mint banner */}
          <div className="relative overflow-hidden rounded-2xl bg-mint-gradient p-6 sm:p-8 min-h-[200px] sm:min-h-[240px] flex flex-col justify-center">
            <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-white/20" />
            <div className="absolute -right-10 bottom-10 h-24 w-24 rounded-full bg-white/15" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/30 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
                <Leaf className="h-3 w-3" /> Mukhvas & More
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-foreground leading-tight max-w-xs">
                Mukhvas, Seeds & Dry Fruits
              </h2>
              <p className="mt-1.5 text-sm text-foreground/80 max-w-xs">
                Tasty mouth fresheners, healthy seeds & premium dry fruits.
              </p>
              <Button
                asChild
                size="sm"
                className="mt-4 bg-primary-gradient hover:opacity-90 text-primary-foreground h-9"
              >
                <a href="#categories">
                  <ShoppingBag className="h-4 w-4 mr-1.5" /> Shop Collection
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Trust badges row */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { icon: ShieldCheck, label: '100% Pure & Natural', sub: 'No fillers' },
            { icon: Truck, label: 'WhatsApp Ordering', sub: 'COD available' },
            { icon: Leaf, label: 'Farm Fresh', sub: 'From Unjha' },
          ].map((b) => (
            <div
              key={b.label}
              className="flex items-center gap-2.5 rounded-xl border border-border bg-white px-3 py-2.5 shadow-sm"
            >
              <div className="grid place-items-center h-9 w-9 shrink-0 rounded-lg bg-primary-gradient text-primary-foreground">
                <b.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{b.label}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
