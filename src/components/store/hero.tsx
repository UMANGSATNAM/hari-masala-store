'use client'

import { ShoppingBag, Leaf, Truck, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Settings } from '@/lib/types'

export function Hero({ settings }: { settings: Settings }) {
  const parseHeroImage = (val: string | null) => {
    if (!val) return '/hero-banner.jpg'
    try {
      const parsed = JSON.parse(val)
      return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : '/hero-banner.jpg'
    } catch {
      return val
    }
  }

  const imageSrc = parseHeroImage(settings.heroImage)
  return (
    <section id="home" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        {/* The Welcome text was removed because the image banner already contains it */}

        {/* Main Hero Banner Image */}
        <div className="mt-2 relative overflow-hidden rounded-2xl w-full shadow-sm hover:shadow-md transition-shadow">
          <a href="#categories" className="block w-full leading-none">
            <img 
              src={imageSrc} 
              alt="Hari Masala - Banner" 
              className="w-full h-auto block"
            />
          </a>
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
