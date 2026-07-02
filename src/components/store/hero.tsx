'use client'

import { ShoppingBag, Truck, ShieldCheck, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Settings } from '@/lib/types'

export function Hero({ settings }: { settings: Settings }) {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0">
        {settings.heroImage ? (
           
          <img
            src={settings.heroImage}
            alt="Indian spices arrangement"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-spice-gradient" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron-gradient/90 text-secondary-foreground px-3 py-1 text-xs font-semibold shadow">
            <Leaf className="h-3.5 w-3.5" /> 100% Pure & Natural
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight text-balance">
            {settings.storeName}
            <span className="block text-saffron text-2xl sm:text-3xl lg:text-4xl mt-2 font-semibold">
              {settings.storeTagline}
            </span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-white/85 max-w-xl">
            Hand-picked, stone-ground and packed fresh. From farm-fresh turmeric to
            royal saffron — bring authentic Indian flavour to your kitchen.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-saffron-gradient text-secondary-foreground hover:opacity-90 px-7 h-12 text-base"
            >
              <a href="#shop">
                <ShoppingBag className="h-5 w-5 mr-2" /> Shop Spices
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/40 text-white hover:bg-white/20 hover:text-white px-7 h-12 text-base"
            >
              <a href="#features">Why Choose Us</a>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-9 grid grid-cols-3 gap-3 max-w-lg">
            {[
              { icon: ShieldCheck, label: 'No Preservatives' },
              { icon: Truck, label: 'WhatsApp Order' },
              { icon: Leaf, label: 'Farm Fresh' },
            ].map((b) => (
              <div
                key={b.label}
                className="flex flex-col items-center gap-1.5 rounded-xl bg-white/10 backdrop-blur px-2 py-3 text-center border border-white/15"
              >
                <b.icon className="h-5 w-5 text-saffron" />
                <span className="text-[11px] sm:text-xs font-medium text-white/90 leading-tight">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
