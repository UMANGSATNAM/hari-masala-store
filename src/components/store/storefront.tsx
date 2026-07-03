'use client'

import { useState } from 'react'
import { StoreHeader } from './store-header'
import { Hero } from './hero'
import { CategoryCards } from './category-cards'
import { ShopSection } from './shop-section'
import { FeaturesSection } from './features-section'
import { StoreFooter } from './store-footer'
import { CartDrawer } from './cart-drawer'
import { CheckoutDialog } from './checkout-dialog'
import type { Category, Product, Settings } from '@/lib/types'

export function Storefront({
  settings,
  categories,
  products,
  loading,
  activeCategory,
  onCategoryChange,
  search,
  onSearch,
  onAdminClick,
}: {
  settings: Settings
  categories: Category[]
  products: Product[]
  loading: boolean
  activeCategory: string
  onCategoryChange: (slug: string) => void
  search: string
  onSearch: (q: string) => void
  onAdminClick: () => void
}) {
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StoreHeader settings={settings} onSearch={onSearch} />
      <main className="flex-1">
        <Hero settings={settings} />
        <CategoryCards
          categories={categories}
          products={products}
          onSelect={onCategoryChange}
        />
        <ShopSection
          categories={categories}
          products={products}
          loading={loading}
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
          search={search}
        />
        <FeaturesSection />
      </main>
      <StoreFooter settings={settings} onAdminClick={onAdminClick} />

      <CartDrawer settings={settings} onCheckout={() => setCheckoutOpen(true)} />
      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} settings={settings} />
    </div>
  )
}
