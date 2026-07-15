'use client'

import { Flame, ShieldCheck, Heart, Sparkles, Award, Users, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StoreHeader } from './store-header'
import { StoreFooter } from './store-footer'
import { CartDrawer } from './cart-drawer'
import { CheckoutDialog } from './checkout-dialog'
import { WhatsAppFloatingButton } from './whatsapp-floating-button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Settings } from '@/lib/types'

export function AboutView({ settings }: { settings: Settings }) {
  const router = useRouter()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StoreHeader settings={settings} onSearch={(q) => { if (q) router.push(`/?search=${encodeURIComponent(q)}`) }} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-primary/10 py-16 sm:py-24 border-b border-border">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-gradient px-4 py-1.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-sm mb-4">
              <Flame className="h-4 w-4" /> Our Story & Heritage
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
              Bringing Pure, Stone-Ground <span className="text-primary">Gujarati Spices</span> to Every Kitchen
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              At <strong className="text-foreground">{settings.storeName}</strong>, we believe that the soul of authentic Indian food lies in the purity of its spices. No shortcuts, no artificial fillers—just pure aroma and village tradition.
            </p>
          </div>
        </section>

        {/* Our Heritage Story */}
        <section className="py-16 sm:py-20 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                Traditional Chakki Grinding
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground leading-snug">
                Why We Chose Purity Over Mass Production
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Decades ago, households across Gujarat ground their whole spices at home or at local village chakkis right before cooking. The aroma of freshly ground coriander, pungent Unjha cumin, and deep red Kashmiri chili filled entire neighborhoods.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Today, commercial factory spices are ground at high speeds using metal blades that heat up and burn away vital natural essential oils. At <strong className="text-foreground">Hari Masala</strong>, we preserve the old ways. We source our raw spices directly from trusted farming collectives across Gujarat and Rajasthan, cleaning them thoroughly, and slow-grinding them at controlled temperatures.
              </p>

              <div className="pt-2 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border">
                  <span className="text-2xl font-black text-primary">100%</span>
                  <p className="text-xs font-semibold text-foreground mt-1">Natural & Lab Tested</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border">
                  <span className="text-2xl font-black text-amber-600">10,000+</span>
                  <p className="text-xs font-semibold text-foreground mt-1">Happy Households</p>
                </div>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border bg-muted aspect-[4/3] sm:aspect-square">
              <img
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80"
                alt="Traditional Indian Spices in Bowls"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                <p className="text-white text-sm font-medium">
                  “Spices so pure, you can smell the difference right when you open our packet.”
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Pillars of Purity Grid */}
        <section className="py-16 bg-muted/40 border-y border-border">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                The 3 Pillars of Hari Masala
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Every packet leaving our facility undergoes rigorous visual, aroma, and quality checks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col items-start gap-3 hover:-translate-y-1 transition-transform">
                <span className="grid place-items-center h-12 w-12 rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <h3 className="text-lg font-bold text-foreground">Direct Farmer Sourcing</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We eliminate middlemen by purchasing direct from Unjha, Gondal, and Guntur farmers during peak harvest seasons to ensure uncompromised quality.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col items-start gap-3 hover:-translate-y-1 transition-transform">
                <span className="grid place-items-center h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600">
                  <Sparkles className="h-6 w-6" />
                </span>
                <h3 className="text-lg font-bold text-foreground">Zero Artificial Fillers</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No synthetic dyes, no cornstarch fillers, and no artificial preservatives. What is written on our packet is the only ingredient inside.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col items-start gap-3 hover:-translate-y-1 transition-transform">
                <span className="grid place-items-center h-12 w-12 rounded-xl bg-green-600/10 text-green-600">
                  <Heart className="h-6 w-6" />
                </span>
                <h3 className="text-lg font-bold text-foreground">Authentic Village Taste</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Formulated according to time-tested Kathiawadi and Gujarati home recipes so your family gets exact, consistent flavor every single day.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 sm:py-20 mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <div className="rounded-3xl bg-primary-gradient p-8 sm:p-12 text-primary-foreground shadow-xl flex flex-col items-center gap-6">
            <Award className="h-12 w-12 opacity-90" />
            <h2 className="text-2xl sm:text-4xl font-black max-w-2xl">
              Experience the True Aroma of Pure Spices Today
            </h2>
            <p className="text-sm sm:text-base opacity-90 max-w-xl">
              Free home delivery on orders above ₹{settings.freeShipThreshold}. Pay online or via Cash on Delivery right at your doorstep.
            </p>
            <Button
              size="lg"
              onClick={() => router.push('/')}
              className="bg-white text-foreground hover:bg-white/90 font-bold h-12 px-8 shadow-lg text-base"
            >
              Explore Our Collection <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <StoreFooter settings={settings} onAdminClick={() => router.push('/admin')} />
      <CartDrawer settings={settings} onCheckout={() => setCheckoutOpen(true)} />
      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} settings={settings} />
      <WhatsAppFloatingButton settings={settings} />
    </div>
  )
}
