'use client'

import React, { useRef } from 'react'
import { Printer, X, Download, Store } from 'lucide-react'
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

export function triggerPrintInvoice(order: Order, settings: Settings) {
  const items = parseOrderItems(order)
  const deliveryCharge = getOrderDeliveryCharge(order)
  const total = getFullOrderTotal(order)
  const dateFormatted = formatOrderDate(order.createdAt)

  const logoSrc = settings.logoImage || '/logo.png'
  const fullLogoUrl = logoSrc.startsWith('http')
    ? logoSrc
    : `${window.location.origin}${logoSrc.startsWith('/') ? '' : '/'}${logoSrc}`

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

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Invoice - ${order.orderNumber}</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 10mm 12mm;
        }
        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #111827;
          background: #ffffff;
          margin: 0;
          padding: 16px;
          font-size: 13px;
          line-height: 1.5;
        }
        .invoice-card {
          max-width: 800px;
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 24px;
        }
        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #15803d;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .brand-col {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .logo-img {
          height: 64px;
          width: auto;
          max-width: 140px;
          object-fit: contain;
        }
        .brand-info h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 800;
          color: #15803d;
          letter-spacing: -0.5px;
        }
        .brand-info p {
          margin: 2px 0 0 0;
          font-size: 12px;
          color: #6b7280;
        }
        .invoice-meta {
          text-align: right;
        }
        .invoice-title {
          display: inline-block;
          background-color: #f0fdf4;
          color: #15803d;
          border: 1px solid #bbf7d0;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .meta-details {
          margin-top: 8px;
          font-size: 12px;
          color: #4b5563;
        }
        .meta-details strong {
          color: #111827;
        }
        .customer-section {
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 14px 16px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          gap: 16px;
        }
        .cust-col {
          flex: 1;
        }
        .cust-col h3 {
          margin: 0 0 6px 0;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #6b7280;
        }
        .cust-name {
          font-size: 15px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 3px;
        }
        .cust-text {
          font-size: 12px;
          color: #374151;
          margin: 2px 0;
        }
        table.items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        table.items-table th {
          background-color: #f3f4f6;
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #4b5563;
          border-bottom: 2px solid #e5e7eb;
        }
        .summary-wrapper {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 24px;
        }
        .summary-box {
          width: 280px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 12px 16px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          font-size: 13px;
          color: #4b5563;
        }
        .summary-row.total-row {
          border-top: 2px solid #15803d;
          padding-top: 8px;
          margin-top: 6px;
          font-size: 16px;
          font-weight: 800;
          color: #15803d;
        }
        .terms-box {
          border: 1px dashed #d1d5db;
          background-color: #fdfdfd;
          border-radius: 6px;
          padding: 10px 14px;
          margin-top: 16px;
        }
        .terms-title {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          color: #6b7280;
          margin-bottom: 4px;
          letter-spacing: 0.5px;
        }
        .terms-highlight {
          font-size: 11px;
          font-weight: 700;
          color: #dc2626;
          margin-bottom: 3px;
        }
        .terms-text {
          font-size: 10px;
          color: #6b7280;
          line-height: 1.4;
          margin: 2px 0;
        }
        .footer-note {
          text-align: center;
          font-size: 11px;
          color: #9ca3af;
          margin-top: 20px;
          padding-top: 12px;
          border-top: 1px solid #f3f4f6;
        }
      </style>
    </head>
    <body>
      <div class="invoice-card">
        <!-- Header -->
        <div class="header-row">
          <div class="brand-col">
            <img src="${fullLogoUrl}" alt="${settings.storeName}" class="logo-img" onerror="this.style.display='none'" />
            <div class="brand-info">
              <h1>${settings.storeName}</h1>
              <p>${settings.storeTagline}</p>
              <p>WhatsApp / Call: <strong>+${settings.whatsappNumber}</strong></p>
            </div>
          </div>
          <div class="invoice-meta">
            <div class="invoice-title">Order Invoice</div>
            <div class="meta-details">
              <div>Invoice #: <strong>${order.orderNumber}</strong></div>
              <div>Date: <strong>${dateFormatted}</strong></div>
              <div>Status: <strong>${order.status}</strong></div>
              <div>Payment: <strong>WhatsApp Order / COD</strong></div>
            </div>
          </div>
        </div>

        <!-- Customer / Shipping Details -->
        <div class="customer-section">
          <div class="cust-col">
            <h3>Bill To / Ship To:</h3>
            <div class="cust-name">${order.customerName}</div>
            <div class="cust-text"><strong>Phone:</strong> ${order.customerPhone}</div>
            <div class="cust-text"><strong>Address:</strong> ${fullAddress}</div>
            ${order.notes ? `<div class="cust-text" style="margin-top: 6px; font-style: italic; color: #4b5563;"><strong>Note:</strong> ${order.notes}</div>` : ''}
          </div>
          <div class="cust-col" style="max-width: 220px; text-align: right;">
            <h3>Store Dispatch:</h3>
            <div style="font-weight: 600; color: #111827; font-size: 13px;">Hari Masala Store</div>
            <div class="cust-text">Pure & Authentic Indian Spices</div>
            <div class="cust-text">Gujarat, India</div>
          </div>
        </div>

        <!-- Items Table -->
        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 36px; text-align: center;">#</th>
              <th style="text-align: left;">Item Description</th>
              <th style="width: 100px; text-align: right;">Price</th>
              <th style="width: 60px; text-align: center;">Qty</th>
              <th style="width: 110px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <!-- Totals Summary -->
        <div class="summary-wrapper">
          <div class="summary-box">
            <div class="summary-row">
              <span>Items Subtotal:</span>
              <span>${formatINR(order.subtotal)}</span>
            </div>
            <div class="summary-row">
              <span>Delivery Charge:</span>
              <span>${deliveryDisplay}</span>
            </div>
            <div class="summary-row total-row">
              <span>Grand Total:</span>
              <span>${formatINR(total)}</span>
            </div>
          </div>
        </div>

        <!-- Terms & Conditions (Smaller font as requested) -->
        <div class="terms-box">
          <div class="terms-title">Terms & Conditions / Policy</div>
          <div class="terms-highlight">&bull; Strictly No Return &amp; No Exchange on food &amp; spice products.</div>
          <div class="terms-text">&bull; All spices &amp; products are freshly prepared, vacuum/hygienically packed and sealed.</div>
          <div class="terms-text">&bull; For any issues regarding your shipment, please notify us on WhatsApp (+${settings.whatsappNumber}) within 24 hours of delivery.</div>
          <div class="terms-text">&bull; This is a computer-generated invoice and does not require an authorized signature.</div>
        </div>

        <div class="footer-note">
          Thank you for choosing ${settings.storeName}! Pure spices for authentic taste.
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.focus();
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `

  // Use hidden iframe for clean printing
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
    document.body.appendChild(iframe)
  }

  const doc = iframe.contentWindow?.document || iframe.contentDocument
  if (doc) {
    doc.open()
    doc.write(htmlContent)
    doc.close()
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
              Ready for high-quality printing / PDF generation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handlePrint} size="sm" className="bg-primary-gradient hover:opacity-90 text-primary-foreground font-semibold gap-1.5 shadow-sm">
              <Printer className="h-4 w-4" /> Print Invoice
            </Button>
          </div>
        </DialogHeader>

        {/* Invoice Body (On-screen Preview) */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-zinc-900/50 flex-1 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-xl border border-border/80 shadow-md p-5 sm:p-7 max-w-2xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-primary/40 pb-5">
              <div className="flex items-center gap-3.5">
                {settings.logoImage ? (
                  <img
                    src={settings.logoImage}
                    alt={settings.storeName}
                    className="h-14 w-auto object-contain max-w-[140px]"
                  />
                ) : (
                  <img
                    src="/logo.png"
                    alt={settings.storeName}
                    className="h-14 w-auto object-contain max-w-[140px]"
                    onError={(e) => {
                      // Fallback text if logo file is not loaded
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}
                <div>
                  <h1 className="text-xl font-extrabold text-primary tracking-tight">{settings.storeName}</h1>
                  <p className="text-xs text-muted-foreground">{settings.storeTagline}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    WhatsApp: <span className="font-semibold text-foreground">+{settings.whatsappNumber}</span>
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-block bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
                  Order Invoice
                </span>
                <div className="mt-2 text-xs space-y-0.5 text-muted-foreground">
                  <div>Invoice #: <strong className="text-foreground">{order.orderNumber}</strong></div>
                  <div>Date: <strong className="text-foreground">{dateFormatted}</strong></div>
                  <div>Status: <span className="font-semibold text-primary">{order.status}</span></div>
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
                <p className="font-bold text-sm text-foreground">{settings.storeName}</p>
                <p className="text-muted-foreground">Authentic Indian Spices &amp; Blends</p>
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

            {/* Terms & Conditions (Strictly No Return & No Exchange in smaller font) */}
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
                &bull; For any dispatch queries, please message us on WhatsApp (+{settings.whatsappNumber}).
              </p>
              <p className="text-muted-foreground text-[10px]">
                &bull; This is a computer-generated invoice and requires no physical signature.
              </p>
            </div>

            <div className="text-center text-muted-foreground text-xs pt-2 border-t border-border">
              Thank you for choosing {settings.storeName}! Pure Spices, Authentic Flavours.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-border flex justify-end gap-2 bg-muted/40 shrink-0">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button size="sm" onClick={handlePrint} className="bg-primary-gradient hover:opacity-90 gap-1.5">
            <Printer className="h-4 w-4" /> Print Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
