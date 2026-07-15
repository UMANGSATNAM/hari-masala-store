'use client'

import { useEffect, useState } from 'react'
import { Package, ShoppingCart, Clock, AlertTriangle, IndianRupee, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api-client'
import { formatINR } from '@/lib/format'
import type { Order } from '@/lib/types'
import { ORDER_STATUSES } from '@/lib/types'

type Stats = {
  productCount: number
  orderCount: number
  pendingOrders: number
  lowStock: number
  totalRevenue: number
  recentOrders: Order[]
  categoryStats: { id: string; name: string; icon: string | null; _count: { products: number } }[]
}

const statusColor: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
  SHIPPED: 'bg-purple-100 text-purple-800 border-purple-200',
  DELIVERED: 'bg-green-100 text-green-800 border-green-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200',
}

export function AdminDashboard({ onGoOrders }: { onGoOrders: () => void }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getDashboard().then((d) => {
      setStats(d as Stats)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Total Products', value: stats?.productCount, icon: Package, color: 'text-primary' },
    { label: 'Total Orders', value: stats?.orderCount, icon: ShoppingCart, color: 'text-blue-600' },
    { label: 'Pending Orders', value: stats?.pendingOrders, icon: Clock, color: 'text-amber-600' },
    { label: 'Low Stock Items', value: stats?.lowStock, icon: AlertTriangle, color: 'text-red-600' },
    { label: 'Total Revenue', value: stats ? formatINR(stats.totalRevenue) : null, icon: IndianRupee, color: 'text-green-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Overview of your spice store</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((c) => (
          <Card key={c.label} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{c.label}</span>
                <c.icon className={`h-4 w-4 ${c.color}`} />
              </div>
              {loading ? (
                <Skeleton className="h-7 w-16 mt-2" />
              ) : (
                <p className="text-2xl font-bold text-foreground mt-1">{c.value ?? 0}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent orders */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Recent Orders
            </CardTitle>
            <button onClick={onGoOrders} className="text-xs text-primary hover:underline font-medium">
              View all →
            </button>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 space-y-2">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : stats && stats.recentOrders.length > 0 ? (
              <div className="divide-y divide-border">
                {stats.recentOrders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between px-4 py-3">
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">
                        {o.customerName} · <span className="text-muted-foreground">{o.orderNumber}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {o.itemCount} items · {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-semibold text-sm text-primary">{formatINR(o.total)}</span>
                      <Badge variant="outline" className={`text-[10px] ${statusColor[o.status] || ''}`}>
                        {o.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-6 text-center text-sm text-muted-foreground">No orders yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Category distribution */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Products by Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
              </div>
            ) : stats ? (
              stats.categoryStats.map((c) => {
                const max = Math.max(...stats.categoryStats.map((x) => x._count.products), 1)
                const pct = (c._count.products / max) * 100
                return (
                  <div key={c.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground">{c.icon} {c.name}</span>
                      <span className="font-medium text-muted-foreground">{c._count.products}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-saffron-gradient" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { ORDER_STATUSES, statusColor }
