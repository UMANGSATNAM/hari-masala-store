'use client'

import { ArrowRight } from 'lucide-react'
import type { Category, Product } from '@/lib/types'

const CAT_COLORS: Record<string, string> = {
  'mukhvas': 'bg-saffron-gradient',
  'masala-powders': 'bg-mint-gradient',
  'chilli': 'bg-primary-gradient',
  'hing': 'bg-amber-gradient',
  'whole-spices': 'bg-mint-gradient',
  'seeds-dry-fruits': 'bg-saffron-gradient',
  'fruit-bars': 'bg-primary-gradient',
  'farali-instant': 'bg-amber-gradient',
  'ayurvedic': 'bg-mint-gradient',
}

export function CategoryCards({
  categories,
  products,
  onSelect,
}: {
  categories: Category[]
  products: Product[]
  onSelect: (slug: string) => void
}) {
  // Count products per category
  const countFor = (slug: string) =>
    products.filter((p) => p.category?.slug === slug).length

  // Show top 5 categories as cards (like reference)
  const cards = categories.slice(0, 5)

  return (
    <section id="categories" className="bg-white border-t border-border scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
              Shop by Category
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Explore our range of pure spices, mukhvas & dry fruits
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {cards.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.slug)}
              className="group relative overflow-hidden rounded-xl border border-border bg-white p-4 text-left shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div
                className={`grid place-items-center h-14 w-14 sm:h-16 sm:w-16 rounded-full ${
                  CAT_COLORS[c.slug] || 'bg-mint-gradient'
                } mb-3`}
              >
                <span className="text-2xl sm:text-3xl">{c.icon}</span>
              </div>
              <h3 className="font-semibold text-sm text-foreground leading-tight">{c.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{countFor(c.slug)} products</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-1.5 transition-all">
                Shop Collection <ArrowRight className="h-3 w-3" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
