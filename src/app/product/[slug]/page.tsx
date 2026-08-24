import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { ProductClient } from './product-client'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  if (!slug) return { title: 'Hari Masala' }

  let product: any = null
  try {
    product = await db.product.findUnique({
      where: { slug },
    })
    if (!product) {
      product = await db.product.findFirst({
        where: {
          OR: [
            { id: slug },
            { slug: { equals: slug } },
            { name: { equals: slug.replace(/-/g, ' ') } },
          ],
        },
      })
    }
  } catch (e) {
    console.error('Metadata product query error:', e)
  }

  if (!product) {
    return {
      title: 'Spice Not Found | Hari Masala',
      description: 'Authentic Indian Spices from Hari Masala',
    }
  }

  const label = product.gujaratiName
    ? `${product.gujaratiName} (${product.name})`
    : product.name

  const title = `${label} - Pure & Authentic Spices | Hari Masala`
  const description =
    product.description ||
    `Buy authentic ${product.name} online from Hari Masala. Pure quality, rich aroma, and traditional taste delivered to your doorstep.`

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://harimasala.com'
  let imageUrl = product.image || '/placeholder.svg'
  if (!imageUrl.startsWith('http')) {
    imageUrl = `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
  }

  const productUrl = `${baseUrl}/product/${product.slug}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: productUrl,
      siteName: 'Hari Masala',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: 'website',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  let initialProduct: any = null
  try {
    initialProduct = await db.product.findUnique({
      where: { slug },
    })
  } catch (e) {}

  return <ProductClient initialProduct={initialProduct} />
}
