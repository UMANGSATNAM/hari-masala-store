'use client'

import Link from 'next/link'
import { Plus, Star, Check, Minus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/lib/store'
import { formatINR, discountPercent } from '@/lib/format'
import type { Product } from '@/lib/types'
import { toast } from 'sonner'

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add)
  const [added, setAdded] = useState(false)
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0)
  const cartItems = useCart(s => s.items)

  let parsedVariants = [{ weight: product.weight, price: product.price, mrp: product.mrp }]
  if (product.variants) {
    if (typeof product.variants === 'string') {
      try { parsedVariants = JSON.parse(product.variants) } catch (e) {}
    } else if (Array.isArray(product.variants) && product.variants.length > 0) {
      parsedVariants = product.variants as any
    }
  }
  const selectedVariant = parsedVariants[selectedVariantIdx]
  const cartItem = cartItems.find(i => i.id === (selectedVariant ? `${product.id}-${selectedVariant.weight}` : product.id))
  const discount = discountPercent(selectedVariant.mrp, selectedVariant.price)
  const outOfStock = product.stock <= 0

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (outOfStock) return
    add(product, 1, selectedVariant)
    setAdded(true)
    const label = product.gujaratiName ? `${product.gujaratiName} (${product.name}) - ${selectedVariant.weight}` : `${product.name} - ${selectedVariant.weight}`
    toast.success(`✓ ${label} added to cart`, { duration: 2000 })
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-muted block">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            product.image === '/placeholder.svg' ? 'p-6 opacity-70' : ''
          }`}
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {product.featured && (
            <Badge className="bg-saffron-gradient text-secondary-foreground shadow text-[10px] px-2 py-0.5">
              ★ Bestseller
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-primary-gradient text-primary-foreground shadow text-[10px] px-2 py-0.5">
              {discount}% OFF
            </Badge>
          )}
        </div>
        {outOfStock && (
          <div className="absolute inset-0 grid place-items-center bg-background/70">
            <span className="rounded-md bg-foreground/90 px-3 py-1 text-xs font-semibold text-background">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${product.slug}`} className="min-w-0 hover:text-primary transition-colors">
            {product.gujaratiName && (
              <h3 className="font-semibold text-sm sm:text-base text-foreground truncate leading-tight" lang="gu">
                {product.gujaratiName}
              </h3>
            )}
            <p className="text-xs text-muted-foreground truncate">{product.name}</p>
          </Link>
          <div className="flex items-center gap-0.5 shrink-0 text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-xs font-medium text-foreground">
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {parsedVariants.length > 1 ? (
            <div className="flex flex-wrap gap-1 w-full mb-1">
              {parsedVariants.map((v: any, i: number) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSelectedVariantIdx(i)
                  }}
                  className={`text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full border transition-colors ${
                    i === selectedVariantIdx 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {v.weight}
                </button>
              ))}
            </div>
          ) : (
            <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {selectedVariant.weight}
            </span>
          )}
          <span className="text-[11px] text-muted-foreground">
            {product.stock < 15 && product.stock > 0
              ? `Only ${product.stock} left`
              : 'In stock'}
          </span>
        </div>

        <div className="mt-auto pt-3 flex flex-col gap-2">
          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-primary leading-none">
                {formatINR(selectedVariant.price)}
              </span>
              {discount > 0 && (
                <span className="text-xs text-muted-foreground line-through mt-0.5">
                  {formatINR(selectedVariant.mrp)}
                </span>
              )}
            </div>
          </div>
          {cartItem ? (
            <Button
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                useCart.getState().setOpen(true)
              }}
              className="w-full h-9 px-2 transition-all text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="h-4 w-4 mr-1 shrink-0" /> Added to Cart
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={outOfStock}
              className={`w-full h-9 px-2 transition-all text-xs sm:text-sm ${
                added
                  ? 'bg-green-600 hover:bg-green-600 text-white'
                  : 'bg-primary-gradient hover:opacity-90'
              }`}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4 mr-1 shrink-0" /> Added
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1 shrink-0" /> Add to Cart
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
