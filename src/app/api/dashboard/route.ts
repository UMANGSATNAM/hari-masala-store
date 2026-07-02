import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const [productCount, orderCount, pendingOrders, lowStock, recentOrders, totalRevenueAgg] =
    await Promise.all([
      db.product.count(),
      db.order.count(),
      db.order.count({ where: { status: 'PENDING' } }),
      db.product.count({ where: { stock: { lt: 15 } } }),
      db.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      db.order.aggregate({ _sum: { total: true } }),
    ])

  const categoryStats = await db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: 'asc' },
  })

  return NextResponse.json({
    productCount,
    orderCount,
    pendingOrders,
    lowStock,
    totalRevenue: totalRevenueAgg._sum.total || 0,
    recentOrders,
    categoryStats,
  })
}
