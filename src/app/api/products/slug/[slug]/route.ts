import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    // Try finding exact slug first, or fallback to matching id or partial name
    let product: any = await db.product.findUnique({
      where: { slug },
      include: { categories: true },
    })
    if (!product && slug) {
      // Fallback if accessed by ID or slightly altered slug
      product = await db.product.findFirst({
        where: {
          OR: [
            { id: slug },
            { slug: { equals: slug } },
            { name: { equals: slug.replace(/-/g, ' ') } },
          ],
        },
        include: { categories: true },
      })
    }

    if (!product) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const categoryIds = product.categories.map(c => c.id)

    // Fetch related products
    const relatedProducts = await db.product.findMany({
      where: {
        active: true,
        id: { not: product.id },
        categories: { some: { id: { in: categoryIds } } },
      },
      take: 4,
    })

    return NextResponse.json({ product, relatedProducts })
  } catch (e) {
    console.error('Fetch single product error:', e)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}
