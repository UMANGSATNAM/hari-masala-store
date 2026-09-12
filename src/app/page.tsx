'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { Storefront } from '@/components/store/storefront'
import { AdminGate } from '@/components/admin/admin-gate'
import { AdminApp } from '@/components/admin/admin-app'
import { api } from '@/lib/api-client'
import { useAdmin } from '@/lib/store'
import type { Category, Product, Settings } from '@/lib/types'

const DEFAULT_SETTINGS: Settings = {
  id: 'default',
  storeName: 'Hari Masala',
  storeTagline: 'Pure Spices, Mukhvas & More — From Unjha',
  whatsappNumber: '919879873113',
  freeShipThreshold: 0,
  adminPin: '1234',
  heroImage: null,
  announcement: null,
  logoImage: null,
  priceListPdf: null,
}

export default function Home() {
  const [view, setView] = useState<'store' | 'admin'>('store')
  const isAuthed = useAdmin((s) => s.isAuthed)

  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')

  // Initial data load with mobile-friendly timeout
  useEffect(() => {
    let mounted = true
    const fallbackTimer = setTimeout(() => {
      if (mounted) setLoading(false)
    }, 7000)

    Promise.all([api.getSettings(), api.getCategories(), api.getProducts({ category: 'all' })])
      .then(([s, c, p]) => {
        if (!mounted) return
        if (s?.settings) setSettings(s.settings)
        if (c?.categories) setCategories(c.categories)
        if (p?.products) setProducts(p.products)
      })
      .catch((e) => {
        console.error('Load error:', e)
      })
      .finally(() => {
        if (mounted) {
          clearTimeout(fallbackTimer)
          setLoading(false)
        }
      })

    return () => {
      mounted = false
      clearTimeout(fallbackTimer)
    }
  }, [])

  const refetchProducts = useCallback(async () => {
    try {
      const { products } = await api.getProducts({ category: 'all' })
      setProducts(products)
    } catch (e) {
      console.error('Refetch products error:', e)
    }
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
      list = list.filter((p) => p.categories?.some((c) => c.slug === activeCategory) || p.category?.slug === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.gujaratiName || '').toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }
    return list
  }, [products, activeCategory, search])

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
