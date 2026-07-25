'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Leaf, Truck, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Settings } from '@/lib/types'

export function Hero({ settings }: { settings: Settings }) {
  const parseHeroImages = (val: string | null) => {
    if (!val) return ['/hero-banner.jpg']
    try {
      const parsed = JSON.parse(val)
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : ['/hero-banner.jpg']
    } catch {
      return [val]
    }
  }

  const images = parseHeroImages(settings.heroImage)
  const [currentIdx, setCurrentIdx] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [images.length])
  return (
    <section id="home" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        {/* The Welcome text was removed because the image banner already contains it */}

        <div className="mt-2 relative overflow-hidden rounded-2xl w-full shadow-sm hover:shadow-md transition-shadow bg-muted">
          <a href="#categories" className="block w-full relative leading-none">
            {images.map((src, i) => {
              const isVideo = src.match(/\.(mp4|webm)$/i)
              const pos = i === 0 ? 'relative' : 'absolute inset-0'
              return (
                <div 
                  key={i} 
                  className={`${pos} w-full h-full transition-opacity duration-1000 ${
                    i === currentIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  {isVideo ? (
                    <video 
                      src={src} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="w-full h-auto block"
                    />
                  ) : (
                    <img 
                      src={src} 
                      alt={`Hari Masala - Banner ${i + 1}`} 
                      className="w-full h-auto block"
                    />
                  )}
                </div>
              )
            })}
          </a>
          
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
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
