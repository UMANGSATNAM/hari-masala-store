import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { OrderItem } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

function genOrderNumber() {
  const d = new Date()
  const y = d.getFullYear().toString().slice(-2)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `HM${y}${m}${day}${rand}`
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const where: Record<string, unknown> = {}
  if (status && status !== 'all') where.status = status

  const orders = await db.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 200,
  })
  return NextResponse.json({ orders })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customerName, customerPhone, customerAddress, customerCity, customerPincode, notes, items } = body as {
      customerName: string
      customerPhone: string
      customerAddress: string
      customerCity?: string
      customerPincode?: string
      notes?: string
      items: OrderItem[]
    }

    if (!customerName || !customerPhone || !customerAddress || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
    const itemCount = items.reduce((s, i) => s + i.quantity, 0)
    const orderNumber = genOrderNumber()

    const order = await db.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        customerAddress,
        customerCity: customerCity || null,
        customerPincode: customerPincode || null,
        notes: notes || null,
        items: JSON.stringify(items),
        itemCount,
        subtotal,
        total: subtotal,
        status: 'PENDING',
      },
    })

    // Decrement stock for purchased products
    for (const it of items) {
      await db.product.update({
        where: { id: it.id },
        data: { stock: { decrement: it.quantity } },
      }).catch(() => {})
    }

    return NextResponse.json({ order }, { status: 201 })
  } catch (e) {
    console.error('Create order error:', e)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
