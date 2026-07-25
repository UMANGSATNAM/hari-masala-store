import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { slugify } from '@/lib/format'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: true, primaryProducts: true } } },
    })
    const mapped = categories.map(c => ({
      ...c,
      _count: {
        products: c._count.products + c._count.primaryProducts
      }
    }))
    return NextResponse.json({ categories: mapped })
  } catch (e) {
    console.error('GET /api/categories error:', e)
    return NextResponse.json({ categories: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, icon, sortOrder } = body
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    const slug = slugify(name)
    const category = await db.category.create({
      data: { name, slug, icon: icon || null, sortOrder: Number(sortOrder) || 0 },
    })
    return NextResponse.json({ category }, { status: 201 })
  } catch (e) {
    console.error('Create category error:', e)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
