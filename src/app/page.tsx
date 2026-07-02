'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { Storefront } from '@/components/store/storefront'
import { AdminGate } from '@/components/admin/admin-gate'
import { AdminApp } from '@/components/admin/admin-app'
import { api } from '@/lib/api-client'
import { useAdmin } from '@/lib/store'
import type { Category, Product, Settings } from '@/lib/types'

export default function Home() {
  const [view, setView] = useState<'store' | 'admin'>('store')
  const isAuthed = useAdmin((s) => s.isAuthed)

  const [settings, setSettings] = useState<Settings | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')

  // Initial data load
  useEffect(() => {
    Promise.all([api.getSettings(), api.getCategories(), api.getProducts({ category: 'all' })])
      .then(([s, c, p]) => {
        setSettings(s.settings)
        setCategories(c.categories)
        setProducts(p.products)
      })
      .catch((e) => console.error('Load error:', e))
      .finally(() => setLoading(false))
  }, [])

  const refetchProducts = useCallback(async () => {
    const { products } = await api.getProducts({ category: 'all' })
    setProducts(products)
  }, [])

  // Return to the storefront, refreshing products (prices/stock may have changed in admin)
  const goToStore = useCallback(() => {
    setView('store')
    refetchProducts()
  }, [refetchProducts])

  // Client-side filtering by category + search
  const filteredProducts = useMemo(() => {
    let list = products
    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category?.slug === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.hindiName || '').toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }
    return list
  }, [products, activeCategory, search])

  // Loading / error gate
  if (!settings) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading Hari Masala…</p>
        </div>
      </div>
    )
  }

  // Admin view
  if (view === 'admin') {
    if (!isAuthed) {
      return <AdminGate onExit={goToStore} />
    }
    return (
      <AdminApp
        settings={settings}
        categories={categories}
        onExit={goToStore}
        onSettingsSaved={(s) => setSettings(s)}
      />
    )
  }

  // Store view
  return (
    <Storefront
      settings={settings}
      categories={categories}
      products={filteredProducts}
      loading={loading}
      activeCategory={activeCategory}
      onCategoryChange={setActiveCategory}
      search={search}
      onSearch={setSearch}
      onAdminClick={() => setView('admin')}
    />
  )
}
