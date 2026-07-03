import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { slugify } from '@/lib/format'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') // slug
  const search = searchParams.get('search')
  const featured = searchParams.get('featured')

  const where: Record<string, unknown> = { active: true }
  if (category && category !== 'all') {
    where.category = { slug: category }
  }
  if (featured === 'true') {
    where.featured = true
  }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { gujaratiName: { contains: search } },
      { description: { contains: search } },
    ]
  }

  const products = await db.product.findMany({
    where,
    include: { category: true },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
  })

  return NextResponse.json({ products })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name, gujaratiName, description, price, mrp, weight,
      categoryId, image, stock, featured, active, rating,
    } = body

    if (!name || !description || price == null || !categoryId || !image) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const slug = slugify(name) + '-' + Date.now().toString(36)
    const product = await db.product.create({
      data: {
        name,
        gujaratiName: gujaratiName || null,
        slug,
        description,
        price: Number(price),
        mrp: Number(mrp) || Number(price),
        weight: weight || '100g',
        categoryId,
        image,
        stock: Number(stock) ?? 50,
        featured: Boolean(featured),
        active: active !== false,
        rating: Number(rating) || 4.5,
      },
      include: { category: true },
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (e) {
    console.error('Create product error:', e)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
