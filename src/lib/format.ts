import type { CartItem, Settings } from './types'

export function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

export function discountPercent(mrp: number, price: number): number {
  if (mrp <= 0 || price >= mrp) return 0
  return Math.round(((mrp - price) / mrp) * 100)
}

/** Build a WhatsApp order message and a wa.me link. */
export function buildWhatsAppOrder(args: {
  items: CartItem[]
  subtotal: number
  settings: Settings
  customer: {
    name: string
    phone: string
    address: string
    city?: string
    pincode?: string
    notes?: string
  }
}): { text: string; url: string } {
  const { items, subtotal, settings, customer } = args

  const lines: string[] = []
  lines.push(`*${settings.storeName} — New Order*`)
  lines.push(`Order from website`)
  lines.push('')
  lines.push('*🧾 Items:*')
  items.forEach((it, idx) => {
    lines.push(
      `${idx + 1}. ${it.name}${it.hindiName ? ` (${it.hindiName})` : ''} — ${it.weight}`
    )
    lines.push(
      `   ${it.quantity} x ${formatINR(it.price)} = *${formatINR(it.price * it.quantity)}*`
    )
  })
  lines.push('')
  lines.push(`*Total Items:* ${items.reduce((s, i) => s + i.quantity, 0)}`)
  lines.push(`*Total Amount:* ${formatINR(subtotal)}`)
  lines.push('')
  lines.push('*👤 Customer Details:*')
  lines.push(`Name: ${customer.name}`)
  lines.push(`Phone: ${customer.phone}`)
  lines.push(`Address: ${customer.address}`)
  if (customer.city) lines.push(`City: ${customer.city}`)
  if (customer.pincode) lines.push(`Pincode: ${customer.pincode}`)
  if (customer.notes) lines.push(`Notes: ${customer.notes}`)
  lines.push('')
  lines.push('_Please confirm my order. Payment will be made on delivery._')

  const text = lines.join('\n')
  const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`
  return { text, url }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
