'use client'

import { Plus, Star, Check } from 'lucide-react'
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
  const discount = discountPercent(product.mrp, product.price)
  const outOfStock = product.stock <= 0

  const handleAdd = () => {
    if (outOfStock) return
    add(product, 1)
    setAdded(true)
    toast.success(`${product.name} added to cart`)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        { }
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {product.featured && (
            <Badge className="bg-saffron-gradient text-secondary-foreground shadow text-[10px] px-2 py-0.5">
              ★ Bestseller
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-spice-gradient text-primary-foreground shadow text-[10px] px-2 py-0.5">
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
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
              {product.name}
            </h3>
            {product.hindiName && (
              <p className="text-xs text-muted-foreground">{product.hindiName}</p>
            )}
          </div>
          <div className="flex items-center gap-0.5 shrink-0 text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-xs font-medium text-foreground">
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {product.weight}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {product.stock < 15 && product.stock > 0
              ? `Only ${product.stock} left`
              : 'In stock'}
          </span>
        </div>

        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary">
              {formatINR(product.price)}
            </span>
            {discount > 0 && (
              <span className="text-xs text-muted-foreground line-through">
                {formatINR(product.mrp)}
              </span>
            )}
          </div>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={outOfStock}
            className="bg-spice-gradient hover:opacity-90 h-9 px-3"
          >
            {added ? (
              <>
                <Check className="h-4 w-4 mr-1" /> Added
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" /> Add
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
