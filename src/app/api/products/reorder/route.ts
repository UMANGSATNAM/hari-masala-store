import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, id, targetPosition, positions } = body

    // Bulk position assignment
    if (action === 'set_positions' && Array.isArray(positions)) {
      for (const item of positions) {
        if (item.id && typeof item.position === 'number') {
          await db.product.update({
            where: { id: item.id },
            data: { position: item.position }
          })
        }
      }
      return NextResponse.json({ ok: true })
    }

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    const allProducts = await db.product.findMany({
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
    })

    const targetIdx = allProducts.findIndex((p) => p.id === id)
    if (targetIdx === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    let updatedList = [...allProducts]
    const [targetProduct] = updatedList.splice(targetIdx, 1)

    if (action === 'move_to_top') {
      updatedList.unshift(targetProduct)
    } else if (action === 'move_to_last') {
      updatedList.push(targetProduct)
    } else if (action === 'move_up') {
      const newIdx = Math.max(0, targetIdx - 1)
      updatedList.splice(newIdx, 0, targetProduct)
    } else if (action === 'move_down') {
      const newIdx = Math.min(allProducts.length - 1, targetIdx + 1)
      updatedList.splice(newIdx, 0, targetProduct)
    } else if (action === 'move_to_position' && typeof targetPosition === 'number') {
      const newIdx = Math.max(0, Math.min(allProducts.length - 1, targetPosition - 1))
      updatedList.splice(newIdx, 0, targetProduct)
    } else {
      return NextResponse.json({ error: 'Invalid reorder action' }, { status: 400 })
    }

    // Update positions 1..N sequentially
    await db.$transaction(
      updatedList.map((prod, index) =>
        db.product.update({
          where: { id: prod.id },
          data: { position: index + 1 },
        })
      )
    )

    const refreshedProducts = await db.product.findMany({
      include: { categories: true, category: true },
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json({ ok: true, products: refreshedProducts })
  } catch (e) {
    console.error('Reorder error:', e)
    return NextResponse.json({ error: 'Failed to reorder products' }, { status: 500 })
  }
}
