'use client'

import { useState, useMemo } from 'react'
import {
  Plus,
  Minus,
  Star,
  Check,
  ShieldCheck,
  Truck,
  Flame,
  Share2,
  ArrowLeft,
  ShoppingBag,
  MessageCircle,
  Sparkles,
  HeartHandshake,
  ChevronDown,
  Zap,
  Utensils
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StoreHeader } from './store-header'
import { StoreFooter } from './store-footer'
import { CartDrawer } from './cart-drawer'
import { CheckoutDialog } from './checkout-dialog'
import { WhatsAppFloatingButton } from './whatsapp-floating-button'
import { ProductCard } from './product-card'
import { useCart } from '@/lib/store'
import { formatINR, discountPercent } from '@/lib/format'
import type { Product, Settings } from '@/lib/types'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function ProductDetailView({
  product,
  relatedProducts = [],
  settings,
}: {
  product: Product
  relatedProducts: Product[]
  settings: Settings
}) {
  const router = useRouter()
  const add = useCart((s) => s.add)
  const setOpenCart = useCart((s) => s.setOpen)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'why' | 'recipes' | 'reviews'>('why')
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0)

  let parsedVariants = [{ weight: product.weight, price: product.price, mrp: product.mrp }]
  if (product.variants) {
    if (typeof product.variants === 'string') {
      try { parsedVariants = JSON.parse(product.variants) } catch (e) {}
    } else if (Array.isArray(product.variants) && product.variants.length > 0) {
      parsedVariants = product.variants as any
    }
  }
  const selectedVariant = parsedVariants[selectedVariantIdx]

  const discount = discountPercent(selectedVariant.mrp, selectedVariant.price)
  const outOfStock = product.stock <= 0

  const handleAddToCart = () => {
    if (outOfStock) return
    add(product, qty, selectedVariant)
    setAdded(true)
    const label = product.gujaratiName ? `${product.gujaratiName} (${product.name}) - ${selectedVariant.weight}` : `${product.name} - ${selectedVariant.weight}`
    toast.success(`✓ Added ${qty}x ${label} to cart`)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    if (outOfStock) return
    add(product, qty, selectedVariant)
    setCheckoutOpen(true)
  }

  const handleWhatsAppOrder = () => {
    const label = product.gujaratiName ? `${product.gujaratiName} - ${product.name}` : product.name
    const text = encodeURIComponent(
      `Namaste Hari Masala! I would like to order:\n\n*Product:* ${label}\n*Weight:* ${selectedVariant.weight}\n*Quantity:* ${qty} pack(s)\n*Price:* ${formatINR(selectedVariant.price * qty)}\n\nPlease confirm my order and share delivery details.`
    )
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${text}`, '_blank')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StoreHeader settings={settings} onSearch={(q) => { if (q) router.push(`/?search=${encodeURIComponent(q)}`) }} />

      <main className="flex-1 pb-28">
        {/* Breadcrumbs & Back */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to All Spices
          </button>
        </div>

        {/* Product Hero Grid */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 py-4">
          {/* Left Column: Image & Trust Badges */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col gap-5">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted/40 shadow-lg group">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.featured && (
                  <Badge className="bg-saffron-gradient text-secondary-foreground shadow-md font-bold px-3 py-1">
                    ★ Bestseller Choice
                  </Badge>
                )}
                {discount > 0 && (
                  <Badge className="bg-primary-gradient text-primary-foreground shadow-md font-bold px-3 py-1">
                    FLAT {discount}% OFF
                  </Badge>
                )}
              </div>
              {outOfStock && (
                <div className="absolute inset-0 grid place-items-center bg-background/80 backdrop-blur-sm">
                  <span className="rounded-lg bg-foreground px-4 py-2 text-sm font-bold text-background uppercase tracking-wider">
                    Currently Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Guaranteed Purity Seals */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 p-4 rounded-xl border border-border bg-card/60 shadow-sm text-center">
              <div className="flex flex-col items-center gap-1.5">
                <span className="grid place-items-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-foreground leading-tight">
                  100% Pure & Lab Tested
                </span>
                <span className="text-[10px] text-muted-foreground">No artificial additives</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <span className="grid place-items-center h-10 w-10 rounded-full bg-amber-500/10 text-amber-600">
                  <Sparkles className="h-5 w-5" />
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-foreground leading-tight">
                  Stone Ground Aroma
                </span>
                <span className="text-[10px] text-muted-foreground">Preserves essential oils</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <span className="grid place-items-center h-10 w-10 rounded-full bg-green-600/10 text-green-600">
                  <HeartHandshake className="h-5 w-5" />
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-foreground leading-tight">
                  Direct from Farmers
                </span>
                <span className="text-[10px] text-muted-foreground">Sourced from Unjha & Gondal</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Pricing, & Conversion Engine */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold tracking-wider uppercase text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                {product.categories && product.categories.length > 0 ? (
                  product.categories.map((c: any) => c.name).join(', ')
                ) : (
                  product.category?.name || 'Authentic Spice'
                )}
              </span>
              <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-xs sm:text-sm font-bold text-foreground">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground ml-1">(142+ Verified Reviews)</span>
              </div>
            </div>

            {product.gujaratiName && (
              <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-amber-800 dark:text-amber-400 leading-tight" lang="gu">
                {product.gujaratiName}
              </h1>
            )}
            <h2 className="mt-1 text-xl sm:text-2xl font-bold text-foreground">
              {product.name}
            </h2>

            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Price Box */}
            <div className="mt-6 p-4 sm:p-5 rounded-2xl border border-primary/20 bg-primary/5 dark:bg-primary/10 flex flex-col gap-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
                  {formatINR(selectedVariant.price)}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-base sm:text-lg text-muted-foreground line-through font-medium">
                      {formatINR(selectedVariant.mrp)}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-950/80 px-2.5 py-0.5 rounded-md">
                      Save {discount}% Today
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Pack Size: <span className="font-bold text-foreground">{selectedVariant.weight}</span> · Inclusive of all taxes
              </p>
            </div>

            {/* Variant Selector */}
            {parsedVariants.length > 1 && (
              <div className="mt-6">
                <span className="text-sm font-semibold text-foreground mb-2 block">Pack Size:</span>
                <div className="flex flex-wrap gap-2">
                  {parsedVariants.map((v: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedVariantIdx(i)}
                      className={`px-4 py-2 text-sm font-bold rounded-lg border transition-all ${
                        i === selectedVariantIdx 
                          ? 'border-primary bg-primary/10 text-primary shadow-sm' 
                          : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {v.weight}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Pack options */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">Quantity:</span>
                <div className="flex items-center border border-border rounded-lg overflow-hidden bg-card">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    className="h-10 w-10 grid place-items-center text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="h-10 w-12 grid place-items-center font-bold text-base text-foreground border-x border-border">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    disabled={qty >= product.stock}
                    className="h-10 w-10 grid place-items-center text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1 font-medium text-green-600 dark:text-green-400">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> In Stock ({product.stock} units ready)
                  </span>
                ) : (
                  <span className="font-bold text-destructive">Out of stock</span>
                )}
              </div>
            </div>

            {/* Action Buttons (Main CTA) */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={outOfStock}
                className={`h-13 text-base font-bold shadow-md transition-all ${
                  added
                    ? 'bg-green-600 hover:bg-green-600 text-white'
                    : 'bg-primary-gradient hover:opacity-90'
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-5 w-5 mr-2" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5 mr-2" /> Add to Cart
                  </>
                )}
              </Button>

              <Button
                size="lg"
                onClick={handleBuyNow}
                disabled={outOfStock}
                className="h-13 bg-amber-600 hover:bg-amber-700 text-white text-base font-bold shadow-md"
              >
                <span className="inline-flex items-center gap-1.5"><Zap className="h-4 w-4 fill-current shrink-0" /> Buy Now (Instant Checkout)</span>
              </Button>
            </div>

            {/* Order via WhatsApp CTA */}
            <Button
              variant="outline"
              onClick={handleWhatsAppOrder}
              className="mt-3 w-full h-11 border-green-600/30 bg-green-50/50 hover:bg-green-100/80 dark:bg-green-950/20 dark:hover:bg-green-950/40 text-green-700 dark:text-green-400 font-semibold"
            >
              <MessageCircle className="h-4 w-4 mr-2 text-green-600 fill-current" />
              Prefer ordering on WhatsApp? Click here to chat
            </Button>

            {/* Assurance Bar */}
            <div className="mt-6 pt-5 border-t border-border grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary shrink-0" />
                <span>Fast 24hr Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600 shrink-0" />
                <span>Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" />
                <span>100% Taste Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* High Conversion Information Tabs (Why Hari Masala vs Market, Recipes, Reviews) */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-12">
          <div className="border-b border-border flex gap-6">
            <button
              onClick={() => setActiveTab('why')}
              className={`pb-3 font-bold text-sm sm:text-base border-b-2 transition-colors ${
                activeTab === 'why'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 shrink-0" /> Why Hari Masala is Better?</span>
            </button>
            <button
              onClick={() => setActiveTab('recipes')}
              className={`pb-3 font-bold text-sm sm:text-base border-b-2 transition-colors ${
                activeTab === 'recipes'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="inline-flex items-center gap-2"><Utensils className="h-4 w-4 shrink-0" /> Traditional Usage & Tips</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 font-bold text-sm sm:text-base border-b-2 transition-colors ${
                activeTab === 'reviews'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="inline-flex items-center gap-2"><Star className="h-4 w-4 fill-amber-500 text-amber-500 shrink-0" /> Customer Reviews (142+)</span>
            </button>
          </div>

          <div className="py-6">
            {activeTab === 'why' && (
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  The Hari Masala Difference vs. Ordinary Store Spices
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                    <span className="font-bold text-primary flex items-center gap-2">
                      <Check className="h-5 w-5" /> Hari Masala Pure Ground Spices
                    </span>
                    <ul className="text-sm text-foreground space-y-1.5 ml-7 list-disc">
                      <li>Ground at slow temperatures using traditional stone chakki methods to keep natural essential oils intact.</li>
                      <li>Sourced directly from authentic farming belts in Gujarat & Rajasthan.</li>
                      <li>0% artificial colors, sawdust fillers, or chemical preservatives.</li>
                      <li>Natural deep color, pungent aroma, and authentic village taste.</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/60 border border-border space-y-2 opacity-80">
                    <span className="font-bold text-muted-foreground flex items-center gap-2">
                      ✕ Ordinary Machine-Ground Spices
                    </span>
                    <ul className="text-sm text-muted-foreground space-y-1.5 ml-7 list-disc">
                      <li>High-speed metal grinding burns off essential aroma and volatile natural oils.</li>
                      <li>Often mixed with starch, flour fillers, or synthetic dyes for bulk weight.</li>
                      <li>Old warehouse stock that loses freshness within weeks of opening.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'recipes' && (
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-foreground">
                  How to use {product.name} in daily Indian & Gujarati cooking
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Because Hari Masala spices are exceptionally pure and concentrated, you only need <span className="font-bold text-foreground">3/4th of the quantity</span> compared to regular store-bought masala.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-muted/40 border border-border">
                    <span className="font-bold text-sm text-primary">1. Everyday Tadka & Sabzi</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add to warm ghee or oil during tadka to release the natural aroma and infuse your daal and sabzi with restaurant-grade flavor.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/40 border border-border">
                    <span className="font-bold text-sm text-primary">2. Marination & Chutneys</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Blend into curd marinades for paneer/vegetables or grind fresh with coriander and garlic for vibrant homemade chutneys.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/40 border border-border">
                    <span className="font-bold text-sm text-primary">3. Storage Tip for Freshness</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      After opening our pouch, transfer the spice immediately to a dry, airtight glass container away from direct sunlight.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
                  <div>
                    <span className="text-3xl font-black text-foreground">4.9</span>
                    <span className="text-sm text-muted-foreground"> / 5.0 Rating</span>
                    <div className="flex items-center gap-1 text-amber-500 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-md">
                    We take pride in our 10,000+ happy Gujarati households and home chefs who trust only Hari Masala for their daily kitchen needs.
                  </p>
                </div>

                {/* Sample realistic reviews */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground">Bhavna Patel (Ahmedabad)</span>
                      <span className="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-950 px-2 py-0.5 rounded">✓ Verified Buyer</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      “Khubaj saras quality! The aroma reminded me of the freshly ground spices from my village in Saurashtra. Color is natural and taste is super pure.”
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground">Rajesh Shah (Surat)</span>
                      <span className="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-950 px-2 py-0.5 rounded">✓ Verified Buyer</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      “Ordered the chili and turmeric pack. Delivery reached Surat within 2 days. The packaging is sturdy and quantity is exact. Highly recommended!”
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-12">
            <h3 className="text-xl font-bold text-foreground mb-4">
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      <StoreFooter settings={settings} onAdminClick={() => router.push('/admin')} />
      <CartDrawer settings={settings} onCheckout={() => setCheckoutOpen(true)} />
      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} settings={settings} />
      <WhatsAppFloatingButton settings={settings} />

      {/* STICKY BUY NOW & ADD TO CART BAR (Floating Bottom Bar for Maximum Conversions) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border p-3 sm:px-6 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img src={product.image} alt="" className="h-11 w-11 rounded-lg object-cover border border-border shrink-0 hidden xs:block" />
          <div className="min-w-0">
            <p className="font-bold text-sm text-foreground truncate">{product.gujaratiName || product.name}</p>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-primary">{formatINR(selectedVariant.price)}</span>
              {discount > 0 && <span className="text-xs text-muted-foreground line-through">{formatINR(selectedVariant.mrp)}</span>}
              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-medium">{selectedVariant.weight}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={`h-10 px-4 font-bold ${
              added
                ? 'bg-green-600 hover:bg-green-600 text-white'
                : 'bg-primary-gradient hover:opacity-90'
            }`}
          >
            {added ? '✓ Added' : 'Add to Cart'}
          </Button>

          <Button
            size="sm"
            onClick={handleBuyNow}
            disabled={outOfStock}
            className="h-10 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold"
          >
            <span className="inline-flex items-center gap-1.5"><Zap className="h-4 w-4 fill-current shrink-0" /> Buy Now</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
