'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Printer, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatINR } from '@/lib/format'
import { parseOrderItems, getOrderDeliveryCharge, getFullOrderTotal, formatOrderDate } from '@/lib/order-utils'
import type { Order, Settings } from '@/lib/types'

function InvoiceContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('id')

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      setError('No Order ID provided')
      setLoading(false)
      return
    }

    fetch(`/api/orders/${orderId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Order not found')
        return res.json()
      })
      .then((data) => {
        if (data.order) {
          setOrder(data.order)
        } else {
          setError('Order not found')
        }
      })
      .catch((err) => {
        console.error('Failed to fetch order:', err)
        setError('Failed to load order invoice')
      })
      .finally(() => setLoading(false))
  }, [orderId])

  useEffect(() => {
    if (order && !loading) {
      // Auto trigger print after short delay
      const t = setTimeout(() => {
        window.print()
      }, 500)
      return () => clearTimeout(t)
    }
  }, [order, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-green-700 mb-2" />
        <p className="text-sm font-medium text-slate-600">Loading Order Invoice…</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center max-w-sm">
          <p className="text-sm font-semibold text-red-600 mb-3">{error || 'Invoice not found'}</p>
          <Button onClick={() => router.push('/admin')} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Admin
          </Button>
        </div>
      </div>
    )
  }

  const items = parseOrderItems(order)
  const deliveryCharge = getOrderDeliveryCharge(order)
  const total = getFullOrderTotal(order)
  const dateFormatted = formatOrderDate(order.createdAt)

  const addrParts: string[] = [order.customerAddress]
  if (order.customerCity) addrParts.push(order.customerCity)
  if (order.customerState) addrParts.push(order.customerState)
  const fullAddress = addrParts.join(', ') + (order.customerPincode ? ` - ${order.customerPincode}` : '')

  const deliveryDisplay =
    deliveryCharge > 0
      ? formatINR(deliveryCharge)
      : order.customerState && order.customerState !== 'Gujarat' && !order.customerCity?.toLowerCase().includes('mumbai')
      ? 'Other State (On WhatsApp)'
      : 'FREE (₹0)'

  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-6 print:p-0 print:bg-white text-slate-900">
      {/* Action Bar (Hidden in Print) */}
      <div className="max-w-[800px] mx-auto mb-4 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3 print:hidden shadow-sm">
        <Button onClick={() => router.push('/admin')} variant="outline" size="sm" className="gap-1.5 bg-white">
          <ArrowLeft className="h-4 w-4" /> Back to Admin
        </Button>
        <div className="font-bold text-green-900 text-sm hidden sm:block">
          Sandip Patel &mdash; Order #{order.orderNumber}
        </div>
        <Button onClick={() => window.print()} size="sm" className="bg-green-700 hover:bg-green-800 text-white font-bold gap-1.5 shadow-sm">
          <Printer className="h-4 w-4" /> Print / Save PDF
        </Button>
      </div>

      {/* Invoice Card */}
      <div className="max-w-[800px] mx-auto bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm print:shadow-none print:border-none print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-green-700 pb-4 mb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-green-700 tracking-tight uppercase">
              Sandip Patel
            </h1>
            <div className="text-base font-extrabold text-slate-900 mt-1">
              Mo No :- 7359487611
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pure &amp; Authentic Indian Spices &bull; Gujarat, India
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded text-xs font-extrabold uppercase tracking-wide">
              Order Invoice
            </span>
            <div className="mt-2 text-xs text-slate-600 space-y-0.5">
              <div>Invoice #: <strong className="text-slate-900">{order.orderNumber}</strong></div>
              <div>Date: <strong className="text-slate-900">{dateFormatted}</strong></div>
              <div>Status: <strong className="text-green-700">{order.status}</strong></div>
              <div>Payment: <strong className="text-slate-900">WhatsApp Order / COD</strong></div>
            </div>
          </div>
        </div>

        {/* Bill To & Dispatched By */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-5 flex flex-col sm:flex-row justify-between gap-4 text-xs">
          <div className="flex-1">
            <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-500 mb-1">
              Bill To / Ship To:
            </h3>
            <div className="font-bold text-sm text-slate-900 mb-0.5">{order.customerName}</div>
            <div className="text-slate-700"><strong>Phone:</strong> {order.customerPhone}</div>
            <div className="text-slate-700"><strong>Address:</strong> {fullAddress}</div>
            {order.notes && (
              <div className="text-slate-600 italic mt-1 pt-1 border-t border-slate-200">
                <strong>Note:</strong> {order.notes}
              </div>
            )}
          </div>
          <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 sm:max-w-[220px]">
            <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-500 mb-1">
              Dispatched By:
            </h3>
            <div className="font-bold text-sm text-slate-900">Sandip Patel</div>
            <div className="font-bold text-xs text-green-700">Mo No :- 7359487611</div>
            <div className="text-slate-600">Gujarat, India</div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-xs border-collapse mb-5">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-200">
              <th className="p-2.5 text-center w-9 text-slate-600 font-bold uppercase text-[11px]">#</th>
              <th className="p-2.5 text-left text-slate-600 font-bold uppercase text-[11px]">Item Description</th>
              <th className="p-2.5 text-right w-24 text-slate-600 font-bold uppercase text-[11px]">Price</th>
              <th className="p-2.5 text-center w-14 text-slate-600 font-bold uppercase text-[11px]">Qty</th>
              <th className="p-2.5 text-right w-24 text-slate-600 font-bold uppercase text-[11px]">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item, idx) => (
              <tr key={idx}>
                <td className="p-2.5 text-center text-slate-500">{idx + 1}</td>
                <td className="p-2.5">
                  <div className="font-semibold text-slate-900">
                    {item.name}
                    {item.gujaratiName && (
                      <span className="text-slate-500 ml-1 font-normal">({item.gujaratiName})</span>
                    )}
                  </div>
                  {item.weight && (
                    <div className="text-[11px] text-slate-500">Pack: {item.weight}</div>
                  )}
                </td>
                <td className="p-2.5 text-right text-slate-700">{formatINR(item.price)}</td>
                <td className="p-2.5 text-center font-bold text-slate-900">{item.quantity}</td>
                <td className="p-2.5 text-right font-bold text-slate-900">{formatINR(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Summary */}
        <div className="flex justify-end mb-5">
          <div className="w-72 bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal:</span>
              <span className="font-semibold text-slate-900">{formatINR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Charge:</span>
              <span className="font-semibold text-slate-900">{deliveryDisplay}</span>
            </div>
            <div className="flex justify-between border-t-2 border-green-700 pt-2 mt-1 text-sm font-extrabold text-green-700">
              <span>Grand Total:</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="border border-dashed border-slate-300 bg-slate-50/50 rounded-lg p-3 text-[11px] space-y-1 mb-5">
          <div className="font-bold text-[10px] uppercase text-slate-500 tracking-wider">
            Terms &amp; Conditions / Policy
          </div>
          <div className="font-bold text-red-600">
            &bull; Strictly No Return &amp; No Exchange on food &amp; spice products.
          </div>
          <div className="text-slate-500">
            &bull; All spices &amp; products are freshly prepared, vacuum/hygienically packed and sealed.
          </div>
          <div className="text-slate-500">
            &bull; For any issues regarding your shipment, please notify on Call / WhatsApp (<strong>Mo No :- 7359487611</strong>) within 24 hours of delivery.
          </div>
          <div className="text-slate-500">
            &bull; This is a computer-generated invoice and does not require an authorized signature.
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs font-semibold text-slate-500 pt-3 border-t border-slate-200">
          Thank you for your order! &bull; Sandip Patel &bull; Mo No :- 7359487611
        </div>
      </div>
    </div>
  )
}

export default function AdminInvoicePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="h-8 w-8 animate-spin text-green-700" />
        </div>
      }
    >
      <InvoiceContent />
    </Suspense>
  )
}
