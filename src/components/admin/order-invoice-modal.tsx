'use client'

import React from 'react'
import { Printer, ExternalLink, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatINR } from '@/lib/format'
import { parseOrderItems, getOrderDeliveryCharge, getFullOrderTotal, formatOrderDate } from '@/lib/order-utils'
import type { Order, Settings } from '@/lib/types'

/**
 * Returns clean HTML of the invoice card (to inject inside in-page #invoice-print-section)
 */
export function getInvoiceCardHtml(order: Order, settings: Settings): string {
  const items = parseOrderItems(order)
  const deliveryCharge = getOrderDeliveryCharge(order)
  const total = getFullOrderTotal(order)
  const dateFormatted = formatOrderDate(order.createdAt)

  const itemsRows = items
    .map((item, idx) => {
      const gujText = item.gujaratiName ? ` <span style="font-family: inherit; color: #4b5563;">(${item.gujaratiName})</span>` : ''
      const weightText = item.weight ? ` &middot; <span style="color: #6b7280; font-size: 11px;">${item.weight}</span>` : ''
      const itemTotal = item.price * item.quantity
      return `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">${idx + 1}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb;">
            <div style="font-weight: 600; color: #111827; font-size: 13px;">${item.name}${gujText}</div>
            ${weightText ? `<div style="margin-top: 2px;">${weightText}</div>` : ''}
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #374151; font-size: 13px;">${formatINR(item.price)}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: 600; color: #111827; font-size: 13px;">${item.quantity}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600; color: #111827; font-size: 13px;">${formatINR(itemTotal)}</td>
        </tr>
      `
    })
    .join('')

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

  return `
    <div class="invoice-card" style="max-width: 800px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827; font-size: 13px; line-height: 1.5;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #15803d; padding-bottom: 16px; margin-bottom: 20px;">
        <div>
          <h1 style="margin: 0; font-size: 26px; font-weight: 900; color: #15803d; letter-spacing: -0.5px; text-transform: uppercase;">Sandip Patel</h1>
          <div style="font-size: 15px; font-weight: 800; color: #111827; margin-top: 4px;">Mo No :- 7359487611</div>
          <p style="margin: 2px 0 0 0; font-size: 12px; color: #6b7280;">Pure & Authentic Indian Spices &bull; Gujarat, India</p>
        </div>
        <div style="text-align: right;">
          <div style="display: inline-block; background-color: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
            Order Invoice
          </div>
          <div style="margin-top: 8px; font-size: 12px; color: #4b5563;">
            <div>Invoice #: <strong style="color: #111827;">${order.orderNumber}</strong></div>
            <div>Date: <strong style="color: #111827;">${dateFormatted}</strong></div>
            <div>Status: <strong style="color: #15803d;">${order.status}</strong></div>
            <div>Payment: <strong style="color: #111827;">WhatsApp Order / COD</strong></div>
          </div>
        </div>
      </div>

      <!-- Customer / Shipping Details -->
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px 16px; margin-bottom: 20px; display: flex; justify-content: space-between; gap: 16px;">
        <div style="flex: 1;">
          <h3 style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Bill To / Ship To:</h3>
          <div style="font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 3px;">${order.customerName}</div>
          <div style="font-size: 12px; color: #374151; margin: 2px 0;"><strong>Phone:</strong> ${order.customerPhone}</div>
          <div style="font-size: 12px; color: #374151; margin: 2px 0;"><strong>Address:</strong> ${fullAddress}</div>
          ${order.notes ? `<div style="margin-top: 6px; font-style: italic; color: #4b5563; font-size: 12px;"><strong>Note:</strong> ${order.notes}</div>` : ''}
        </div>
        <div style="max-width: 220px; text-align: right;">
          <h3 style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Dispatched By:</h3>
          <div style="font-weight: 700; color: #111827; font-size: 14px;">Sandip Patel</div>
          <div style="font-size: 12px; font-weight: 600; color: #15803d; margin: 2px 0;">Mo No :- 7359487611</div>
          <div style="font-size: 12px; color: #374151; margin: 2px 0;">Gujarat, India</div>
        </div>
      </div>

      <!-- Items Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f3f4f6; border-bottom: 2px solid #e5e7eb;">
            <th style="padding: 8px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #4b5563; width: 36px; text-align: center;">#</th>
            <th style="padding: 8px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #4b5563; text-align: left;">Item Description</th>
            <th style="padding: 8px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #4b5563; width: 100px; text-align: right;">Price</th>
            <th style="padding: 8px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #4b5563; width: 60px; text-align: center;">Qty</th>
            <th style="padding: 8px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #4b5563; width: 110px; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <!-- Totals Summary -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
        <div style="width: 280px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 16px;">
          <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; color: #4b5563;">
            <span>Items Subtotal:</span>
            <span>${formatINR(order.subtotal)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; color: #4b5563;">
            <span>Delivery Charge:</span>
            <span>${deliveryDisplay}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-top: 2px solid #15803d; padding-top: 8px; margin-top: 6px; font-size: 16px; font-weight: 800; color: #15803d;">
            <span>Grand Total:</span>
            <span>${formatINR(total)}</span>
          </div>
        </div>
      </div>

      <!-- Terms & Conditions -->
      <div style="border: 1px dashed #d1d5db; background-color: #fdfdfd; border-radius: 6px; padding: 10px 14px; margin-top: 16px;">
        <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #6b7280; margin-bottom: 4px; letter-spacing: 0.5px;">Terms & Conditions / Policy</div>
        <div style="font-size: 11px; font-weight: 700; color: #dc2626; margin-bottom: 3px;">&bull; Strictly No Return &amp; No Exchange on food &amp; spice products.</div>
        <div style="font-size: 10px; color: #6b7280; line-height: 1.4; margin: 2px 0;">&bull; All spices &amp; products are freshly prepared, vacuum/hygienically packed and sealed.</div>
        <div style="font-size: 10px; color: #6b7280; line-height: 1.4; margin: 2px 0;">&bull; For any issues regarding your shipment, please notify on Call / WhatsApp (<strong>Mo No :- 7359487611</strong>) within 24 hours of delivery.</div>
        <div style="font-size: 10px; color: #6b7280; line-height: 1.4; margin: 2px 0;">&bull; This is a computer-generated invoice and does not require an authorized signature.</div>
      </div>

      <div style="text-align: center; font-size: 11px; font-weight: 600; color: #6b7280; margin-top: 20px; padding-top: 12px; border-top: 1px solid #f3f4f6;">
        Thank you for your order! &bull; Sandip Patel &bull; Mo No :- 7359487611
      </div>
    </div>
  `
}

/**
 * Returns a complete standalone HTML document for clean printing or opening in new window
 */
export function getInvoiceFullHtml(order: Order, settings: Settings): string {
  const cardHtml = getInvoiceCardHtml(order, settings)

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice - ${order.orderNumber} - Sandip Patel</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 8mm 10mm;
        }
        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #111827;
          background: #f3f4f6;
          margin: 0;
          padding: 16px;
          font-size: 13px;
          line-height: 1.5;
        }
        .no-print {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          padding: 12px 18px;
          max-width: 800px;
          margin: 0 auto 16px auto;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .btn-print {
          background-color: #15803d;
          color: #ffffff;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .btn-print:hover {
          background-color: #166534;
        }
        .btn-close {
          background-color: #e5e7eb;
          color: #374151;
          border: none;
          padding: 8px 14px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          margin-left: 8px;
        }
        .btn-close:hover {
          background-color: #d1d5db;
        }
        @media print {
          body {
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .invoice-card {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="no-print">
        <div style="font-weight: 700; color: #15803d; font-size: 14px;">
          Sandip Patel &mdash; Order #${order.orderNumber}
        </div>
        <div>
          <button onclick="window.print()" class="btn-print">🖨️ Print / Save as PDF</button>
          <button onclick="window.close()" class="btn-close">✕ Close</button>
        </div>
      </div>

      ${cardHtml}

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.focus();
            window.print();
          }, 350);
        };
      </script>
    </body>
    </html>
  `
}

/**
 * Directly opens clean invoice in a new tab (perfect for iPhone Safari / PDF share sheet)
 */
export function openInvoiceInNewTab(order: Order, settings: Settings) {
  if (order.id && typeof window !== 'undefined') {
    const win = window.open(`/admin/invoice?id=${order.id}`, '_blank')
    if (win) return
  }
  const html = getInvoiceFullHtml(order, settings)
  const printWin = window.open('', '_blank')
  if (printWin) {
    printWin.document.open()
    printWin.document.write(html)
    printWin.document.close()
  }
}

/**
 * Cross-platform print handler.
 * On iPhone (iOS Safari): opens dedicated invoice tab where iOS Safari prints ONLY this single invoice
 * On Desktop & Android: triggers isolated print with @media print parent isolation
 */
export function triggerPrintInvoice(order: Order, settings: Settings) {
  const html = getInvoiceFullHtml(order, settings)
  const cardOnly = getInvoiceCardHtml(order, settings)

  // Detect iOS Safari / WebKit (iPhone / iPad / iPod)
  const isIOS =
    typeof navigator !== 'undefined' &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

  if (isIOS) {
    // Calling window.print() inside an invisible iframe causes iOS Safari to print the entire parent page
    // (displaying all other orders in the admin table).
    // Opening in a new window/tab gives iOS a dedicated document containing ONLY this invoice.
    if (order.id && typeof window !== 'undefined') {
      const win = window.open(`/admin/invoice?id=${order.id}`, '_blank')
      if (win) return
    }

    const printWin = window.open('', '_blank')
    if (printWin) {
      printWin.document.open()
      printWin.document.write(html)
      printWin.document.close()
      return
    }
  }

  // Fallback and in-page container setup
  let printContainer = document.getElementById('invoice-print-section')
  if (!printContainer) {
    printContainer = document.createElement('div')
    printContainer.id = 'invoice-print-section'
    document.body.appendChild(printContainer)
  }
  printContainer.innerHTML = cardOnly

  // Add isolation class to body so @media print hides all 10 background orders
  document.body.classList.add('is-printing-invoice')

  const cleanup = () => {
    document.body.classList.remove('is-printing-invoice')
    window.removeEventListener('afterprint', cleanup)
  }
  window.addEventListener('afterprint', cleanup)

  // Use hidden iframe for clean printing on Android & Desktop
  let iframe = document.getElementById('invoice-print-frame') as HTMLIFrameElement
  if (!iframe) {
    iframe = document.createElement('iframe')
    iframe.id = 'invoice-print-frame'
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    iframe.style.zIndex = '-9999'
    document.body.appendChild(iframe)
  }

  const doc = iframe.contentWindow?.document || iframe.contentDocument
  if (doc) {
    doc.open()
    doc.write(html)
    doc.close()
    setTimeout(cleanup, 4000)
  } else {
    setTimeout(() => {
      window.print()
      setTimeout(cleanup, 2500)
    }, 200)
  }
}

export function OrderInvoiceModal({
  order,
  settings,
  open,
  onOpenChange,
}: {
  order: Order | null
  settings: Settings
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!order) return null

  const items = parseOrderItems(order)
  const deliveryCharge = getOrderDeliveryCharge(order)
  const total = getFullOrderTotal(order)
  const dateFormatted = formatOrderDate(order.createdAt)

  const addrParts: string[] = [order.customerAddress]
  if (order.customerCity) addrParts.push(order.customerCity)
  if (order.customerState) addrParts.push(order.customerState)
  const fullAddress = addrParts.join(', ') + (order.customerPincode ? ` - ${order.customerPincode}` : '')

  const handlePrint = () => {
    triggerPrintInvoice(order, settings)
  }

  const handleOpenInNewTab = () => {
    openInvoiceInNewTab(order, settings)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[92vh] overflow-y-auto p-0 flex flex-col gap-0 border-border">
        {/* Modal Top Bar */}
        <DialogHeader className="p-4 border-b border-border flex flex-row items-center justify-between bg-muted/40 shrink-0">
          <div>
            <DialogTitle className="text-base sm:text-lg flex items-center gap-2">
              <Printer className="h-5 w-5 text-primary" /> Invoice Preview &mdash; {order.orderNumber}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sandip Patel &bull; Mo No :- 7359487611
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleOpenInNewTab}
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-semibold"
              title="Open in a new clean window / tab (Best for iPhone / Saving PDF)"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Open in</span> New Tab
            </Button>
            <Button onClick={handlePrint} size="sm" className="bg-primary-gradient hover:opacity-90 text-primary-foreground font-semibold gap-1.5 shadow-sm">
              <Printer className="h-4 w-4" /> Print Invoice
            </Button>
          </div>
        </DialogHeader>

        {/* Invoice Body (On-screen Preview) */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-zinc-900/50 flex-1 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-xl border border-border/80 shadow-md p-5 sm:p-7 max-w-2xl mx-auto space-y-6">
            
            {/* Header with Sandip Patel details */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-primary/40 pb-5">
              <div>
                <h1 className="text-2xl font-black text-primary tracking-tight uppercase">Sandip Patel</h1>
                <p className="text-sm font-bold text-foreground mt-0.5">Mo No :- 7359487611</p>
                <p className="text-xs text-muted-foreground mt-0.5">Pure &amp; Authentic Indian Spices &bull; Gujarat, India</p>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-block bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
                  Order Invoice
                </span>
                <div className="mt-2 text-xs space-y-0.5 text-muted-foreground">
                  <div>Invoice #: <strong className="text-foreground">{order.orderNumber}</strong></div>
                  <div>Date: <strong className="text-foreground">{dateFormatted}</strong></div>
                  <div>Status: <span className="font-semibold text-primary">{order.status}</span></div>
                  <div>Payment: <span className="font-semibold text-foreground">WhatsApp Order / COD</span></div>
                </div>
              </div>
            </div>

            {/* Bill To & Ship To Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg bg-muted/30 border border-border/70 p-4 text-xs">
              <div className="space-y-1">
                <p className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">Customer (Bill To / Ship To):</p>
                <p className="font-bold text-sm text-foreground">{order.customerName}</p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Phone:</span> {order.customerPhone}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Address:</span> {fullAddress}
                </p>
                {order.notes && (
                  <p className="text-amber-800 dark:text-amber-300 italic pt-1 border-t border-border/50">
                    <span className="font-semibold">Note:</span> {order.notes}
                  </p>
                )}
              </div>
              <div className="space-y-1 sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-border/50">
                <p className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">Dispatched By:</p>
                <p className="font-bold text-sm text-foreground">Sandip Patel</p>
                <p className="font-bold text-xs text-primary">Mo No :- 7359487611</p>
                <p className="text-muted-foreground">Gujarat, India</p>
                <p className="text-muted-foreground">Payment: <strong className="text-foreground">WhatsApp Order / COD</strong></p>
              </div>
            </div>

            {/* Items Table */}
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-muted/60 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-8">#</th>
                    <th className="py-2.5 px-3 text-left">Item Description</th>
                    <th className="py-2.5 px-3 text-right">Price</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-muted/20">
                      <td className="py-2.5 px-3 text-center text-muted-foreground">{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-foreground">
                          {item.name}
                          {item.gujaratiName && (
                            <span className="text-muted-foreground ml-1" lang="gu">
                              ({item.gujaratiName})
                            </span>
                          )}
                        </div>
                        {item.weight && (
                          <div className="text-[11px] text-muted-foreground">
                            Pack size: {item.weight}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right text-muted-foreground">{formatINR(item.price)}</td>
                      <td className="py-2.5 px-3 text-center font-semibold text-foreground">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-foreground">{formatINR(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="flex justify-end">
              <div className="w-full sm:w-72 rounded-lg bg-muted/40 border border-border p-3.5 space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Items Subtotal:</span>
                  <span className="font-medium text-foreground">{formatINR(order.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Delivery Charge:</span>
                  <span className={deliveryCharge > 0 ? "font-semibold text-amber-700 dark:text-amber-400" : "font-medium text-foreground"}>
                    {deliveryCharge > 0
                      ? formatINR(deliveryCharge)
                      : order.customerState && order.customerState !== 'Gujarat' && !order.customerCity?.toLowerCase().includes('mumbai')
                      ? 'Other State (On WhatsApp)'
                      : 'FREE (₹0)'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t-2 border-primary/30 text-sm font-extrabold text-foreground">
                  <span className="text-primary">Grand Total:</span>
                  <span className="text-primary text-base font-bold">{formatINR(total)}</span>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="rounded-lg border border-dashed border-border bg-muted/15 p-3 text-[11px] space-y-1">
              <p className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground">
                Terms &amp; Conditions / શરતો:
              </p>
              <p className="font-bold text-destructive">
                &bull; Strictly No Return &amp; No Exchange on food &amp; spice products once sold.
              </p>
              <p className="text-muted-foreground text-[10px]">
                &bull; All items are hygienically prepared and sealed to guarantee fresh aroma &amp; taste.
              </p>
              <p className="text-muted-foreground text-[10px]">
                &bull; For any dispatch queries, please message or call: <strong>Mo No :- 7359487611</strong> within 24 hours of delivery.
              </p>
              <p className="text-muted-foreground text-[10px]">
                &bull; This is a computer-generated invoice and requires no physical signature.
              </p>
            </div>

            <div className="text-center text-muted-foreground text-xs pt-2 border-t border-border font-medium">
              Thank you for your order! &bull; Sandip Patel &bull; Mo No :- 7359487611
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-border flex justify-end gap-2 bg-muted/40 shrink-0">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={handleOpenInNewTab}
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs font-semibold"
            title="Open in a new clean tab"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            New Tab
          </Button>
          <Button size="sm" onClick={handlePrint} className="bg-primary-gradient hover:opacity-90 gap-1.5 text-primary-foreground font-semibold">
            <Printer className="h-4 w-4" /> Print Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
