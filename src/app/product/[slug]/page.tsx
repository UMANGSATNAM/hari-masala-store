'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ProductDetailView } from '@/components/store/product-detail-view'
import { api } from '@/lib/api-client'
import type { Product, Settings } from '@/lib/types'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = typeof params?.slug === 'string' ? params.slug : ''

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    Promise.all([api.getProductBySlug(slug), api.getSettings()])
      .then(([res, s]) => {
        setProduct(res.product)
        setRelatedProducts(res.relatedProducts || [])
        setSettings(s.settings)
      })
      .catch((e) => {
        console.error('Product detail load error:', e)
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading || !settings) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading authentic spice details…</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen grid place-items-center bg-background p-4 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Spice Not Found</h1>
          <p className="text-sm text-muted-foreground">
            The spice you are looking for might have been moved or discontinued.
          </p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary-gradient text-primary-foreground font-semibold text-sm shadow hover:opacity-90 transition"
          >
            Explore All Spices
          </button>
        </div>
      </div>
    )
  }

  return (
    <ProductDetailView
      product={product}
      relatedProducts={relatedProducts}
      settings={settings}
    />
  )
}
