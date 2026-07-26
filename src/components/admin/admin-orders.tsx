'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Eye, Trash2, Phone, MapPin, Package, Loader2, MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { api } from '@/lib/api-client'
import { formatINR } from '@/lib/format'
import type { Order, OrderItem, Settings } from '@/lib/types'
import { ORDER_STATUSES, statusColor } from './admin-dashboard'
import { toast } from 'sonner'

const STATUS_FILTERS = ['all', ...ORDER_STATUSES] as const

export function AdminOrders({ settings }: { settings: Settings }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [viewOrder, setViewOrder] = useState<Order | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { orders } = await api.getOrders(statusFilter)
      setOrders(orders)
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    load()
  }, [load])

  const changeStatus = async (id: string, status: string) => {
    try {
      const { order } = await api.updateOrder(id, { status })
      setOrders((arr) => arr.map((o) => (o.id === id ? order : o)))
      if (viewOrder?.id === id) setViewOrder(order)
      toast.success(`Order marked as ${status}`)
    } catch {
      toast.error('Failed to update status')
    }
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      await api.deleteOrder(deleteId)
      setOrders((arr) => arr.filter((o) => o.id !== deleteId))
      toast.success('Order deleted')
    } catch {
      toast.error('Failed to delete order')
    } finally {
      setDeleteId(null)
    }
  }

  const parseItems = (o: Order): OrderItem[] => {
    let items: any = o.items;
    if (typeof items === 'string') {
      try { items = JSON.parse(items) } catch { return [] }
    }
    if (typeof items === 'string') {
      try { items = JSON.parse(items) } catch { return [] }
    }
    return Array.isArray(items) ? items : []
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Orders</h2>
          <p className="text-sm text-muted-foreground">Track and manage customer orders</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((s) => (
              <SelectItem key={s} value={s}>{s === 'all' ? 'All Orders' : s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left font-semibold px-4 py-3">Order #</th>
              <th className="text-left font-semibold px-4 py-3">Customer</th>
              <th className="text-left font-semibold px-4 py-3">Items</th>
              <th className="text-left font-semibold px-4 py-3">Total</th>
              <th className="text-left font-semibold px-4 py-3">Date</th>
              <th className="text-left font-semibold px-4 py-3">Status</th>
              <th className="text-right font-semibold px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-4 py-3"><Skeleton className="h-10 w-full" /></td></tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No orders {statusFilter !== 'all' ? `with status "${statusFilter}"` : 'yet'}
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-accent/30">
                  <td className="px-4 py-2.5 font-mono text-xs font-semibold text-primary">{o.orderNumber}</td>
                  <td className="px-4 py-2.5">
                    <p className="font-medium text-foreground">{o.customerName}</p>
                    <p className="text-xs text-muted-foreground">{o.customerPhone}</p>
                  </td>
                  <td className="px-4 py-2.5">
                    <p className="text-muted-foreground">{o.itemCount} items</p>
                    <p className="text-[10px] text-muted-foreground/70 truncate max-w-[150px]" title={parseItems(o).map(it => it.name).join(', ')}>
                      {parseItems(o).map(it => it.name).join(', ')}
                    </p>
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-foreground">{formatINR(o.total)}</td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">
                    {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="px-4 py-2.5">
                    <Select value={o.status} onValueChange={(v) => changeStatus(o.id, v)}>
                      <SelectTrigger className="h-8 w-[130px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setViewOrder(o)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(o.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)
        ) : orders.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <Package className="h-8 w-8 mx-auto mb-2 opacity-50" /> No orders yet
          </div>
        ) : (
          orders.map((o) => (
            <div key={o.id} className="rounded-xl border border-border p-3 bg-card">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-mono text-xs font-semibold text-primary">{o.orderNumber}</p>
                  <p className="font-medium text-sm text-foreground">{o.customerName}</p>
                  <p className="text-xs text-muted-foreground">{o.customerPhone}</p>
                </div>
                <span className="font-bold text-foreground">{formatINR(o.total)}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline" className={`text-[10px] ${statusColor[o.status] || ''}`}>{o.status}</Badge>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="h-7" onClick={() => setViewOrder(o)}>
                    <Eye className="h-3.5 w-3.5 mr-1" /> View
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => setDeleteId(o.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order detail dialog */}
      <Dialog open={!!viewOrder} onOpenChange={(v) => !v && setViewOrder(null)}>
        <DialogContent className="sm:max-w-lg max-h-[92vh] overflow-y-auto scrollbar-thin">
          <DialogHeader>
            <DialogTitle>Order {viewOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              {viewOrder && new Date(viewOrder.createdAt).toLocaleString('en-IN')}
            </DialogDescription>
          </DialogHeader>

          {viewOrder && (
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant="outline" className={statusColor[viewOrder.status] || ''}>{viewOrder.status}</Badge>
              </div>

              {/* Customer */}
              <div className="rounded-lg border border-border p-3 space-y-1.5 text-sm">
                <p className="font-semibold text-foreground">{viewOrder.customerName}</p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" /> {viewOrder.customerPhone}
                </p>
                <p className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {viewOrder.customerAddress}
                  {viewOrder.customerCity && `, ${viewOrder.customerCity}`}
                  {viewOrder.customerPincode && ` - ${viewOrder.customerPincode}`}
                </p>
                {viewOrder.notes && (
                  <p className="text-muted-foreground italic pt-1 border-t border-border">
                    Note: {viewOrder.notes}
                  </p>
                )}
              </div>

              {/* Items */}
              <div className="rounded-lg border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase px-3 py-2 border-b border-border">
                  Items ({viewOrder.itemCount})
                </p>
                <ul className="divide-y divide-border">
                  {parseItems(viewOrder).map((it, idx) => (
                    <li key={idx} className="flex justify-between px-3 py-2 text-sm">
                      <span className="text-foreground" lang="gu">
                        {it.gujaratiName ? `${it.gujaratiName} (${it.name})` : it.name} · {it.weight}
                        <span className="text-muted-foreground"> × {it.quantity}</span>
                      </span>
                      <span className="font-medium">{formatINR(it.price * it.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between px-3 py-2.5 border-t border-border font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatINR(viewOrder.total)}</span>
                </div>
              </div>

              {/* Update status */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium shrink-0">Update status:</span>
                <Select value={viewOrder.status} onValueChange={(v) => changeStatus(viewOrder.id, v)}>
                  <SelectTrigger className="h-9 flex-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <a
                href={`https://wa.me/${viewOrder.customerPhone.replace(/\D/g, '').slice(-10)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 text-white py-2.5 text-sm font-semibold"
              >
                <MessageCircle className="h-4 w-4" /> Message Customer on WhatsApp
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this order?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the order record. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
