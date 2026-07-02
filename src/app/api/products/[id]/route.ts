import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    const data: Record<string, unknown> = {}
    const fields = [
      'name', 'hindiName', 'description', 'price', 'mrp', 'weight',
      'categoryId', 'image', 'stock', 'featured', 'active', 'rating',
    ]
    for (const f of fields) {
      if (body[f] !== undefined) {
        if (['price', 'mrp', 'stock', 'rating'].includes(f)) {
          data[f] = Number(body[f])
        } else if (['featured', 'active'].includes(f)) {
          data[f] = Boolean(body[f])
        } else {
          data[f] = body[f]
        }
      }
    }

    const product = await db.product.update({
      where: { id },
      data,
      include: { category: true },
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
