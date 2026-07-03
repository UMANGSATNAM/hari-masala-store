import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { slugify } from '@/lib/format'

export async function GET() {
  const categories = await db.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  })
  return NextResponse.json({ categories })
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
