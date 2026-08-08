import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    const data: Record<string, unknown> = {}
    const fields = [
      'name', 'gujaratiName', 'description', 'price', 'mrp', 'weight',
      'categoryIds', 'image', 'images', 'stock', 'featured', 'active', 'rating', 'variants'
    ]
    for (const f of fields) {
      if (body[f] !== undefined) {
        if (['price', 'mrp', 'stock', 'rating'].includes(f)) {
          data[f] = Number(body[f])
        } else if (['featured', 'active'].includes(f)) {
          data[f] = Boolean(body[f])
        } else if (f === 'variants' || f === 'images') {
          data[f] = body[f] ? body[f] : null
        } else if (f === 'categoryIds') {
          data.categories = { set: body[f].map((id: string) => ({ id })) }
          data.categoryId = body[f][0] // Maintain temporarily
        } else {
          data[f] = body[f]
        }
      }
    }

    const product = await db.product.update({
      where: { id },
      data,
      include: { categories: true },
    })

    return NextResponse.json({ product })
  } catch (e) {
    console.error('Update product error:', e)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.product.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Delete product error:', e)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
