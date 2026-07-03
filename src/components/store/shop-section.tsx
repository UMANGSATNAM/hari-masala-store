'use client'

import { useMemo } from 'react'
import { SlidersHorizontal, SearchX } from 'lucide-react'
import { ProductCard } from './product-card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Category, Product } from '@/lib/types'

export function ShopSection({
  categories,
  products,
  loading,
  activeCategory,
  onCategoryChange,
  search,
}: {
  categories: Category[]
  products: Product[]
  loading: boolean
  activeCategory: string
  onCategoryChange: (slug: string) => void
  search: string
}) {
  const pills = useMemo(
    () => [{ id: 'all', name: 'All Spices', slug: 'all', icon: '🛍️', sortOrder: 0 }, ...categories],
    [categories]
  )

  return (
    <section id="shop" className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
      <div id="categories" className="flex flex-col gap-2 mb-6 scroll-mt-24">
        <span className="text-primary font-semibold text-sm uppercase tracking-wide">
          Our Collection
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Shop Premium Spices
        </h2>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Explore our range of pure, freshly ground and whole spices — sourced
          directly from farmers and packed with care.
        </p>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin -mx-1 px-1">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0 mr-1" />
        {pills.map((c) => {
          const active = activeCategory === c.slug
          return (
            <button
              key={c.id}
              onClick={() => onCategoryChange(c.slug)}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary-gradient text-primary-foreground border-transparent shadow-sm'
                  : 'bg-card text-muted-foreground border-border hover:border-primary hover:text-primary'
              }`}
            >
              {c.icon && <span>{c.icon}</span>}
              {c.name}
            </button>
          )
        })}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-xl">
          <SearchX className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-medium text-foreground">No spices found</p>
          <p className="text-sm text-muted-foreground">
            {search
              ? `No results for “${search}”. Try a different search.`
              : 'Try selecting a different category.'}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            Showing <span className="font-semibold text-foreground">{products.length}</span>{' '}
            {products.length === 1 ? 'product' : 'products'}
            {activeCategory !== 'all' &&
              ` in ${pills.find((p) => p.slug === activeCategory)?.name}`}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
