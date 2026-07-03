'use client'

import { ShieldCheck, Leaf, Truck, MessageCircle, Award, Sparkles } from 'lucide-react'

const FEATURES = [
  {
    icon: Leaf,
    title: '100% Pure & Natural',
    desc: 'No fillers, no artificial colours, no preservatives. Just pure spice.',
  },
  {
    icon: Award,
    title: 'Premium Grade Quality',
    desc: 'Hand-picked and sorted spices sourced directly from trusted farmers.',
  },
  {
    icon: Sparkles,
    title: 'Freshly Ground',
    desc: 'Stone-ground in small batches to lock in aroma and flavour.',
  },
  {
    icon: ShieldCheck,
    title: 'Hygienically Packed',
    desc: 'Sealed in food-grade packaging to keep freshness intact.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Quick dispatch across India with cash on delivery available.',
  },
  {
    icon: MessageCircle,
    title: 'Easy WhatsApp Ordering',
    desc: 'No app or payment gateway needed — just order on WhatsApp.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-accent/30 border-y border-border scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-primary font-semibold text-sm uppercase tracking-wide">
            Why Hari Masala
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-foreground">
            Spices You Can Trust, Flavour You&apos;ll Love
          </h2>
          <p className="mt-2 text-muted-foreground text-sm">
            Every pinch carries the promise of purity, freshness and authentic
            Indian taste.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex gap-3 rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="grid place-items-center h-11 w-11 shrink-0 rounded-lg bg-primary-gradient text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
