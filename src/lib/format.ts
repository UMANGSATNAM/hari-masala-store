import type { CartItem, Settings } from './types'

export function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

export function discountPercent(mrp: number, price: number): number {
  if (mrp <= 0 || price >= mrp) return 0
  return Math.round(((mrp - price) / mrp) * 100)
}

/**
 * Build a WhatsApp order message in the EXACT format:
 *
 * New Order — Hari Masala
 *
 * Name: <name>
 * Mobile: <phone>
 * Address: <address>, <city>, Gujarat - <pincode>
 *
 * Order Details:
 * * ગુજરાતી નામ (English Name) (weight) xN = ₹price
 * ...
 *
 * Total: ₹<total>
 *
 * Please confirm my order
 */
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

  // Address line: "address, city, Gujarat - pincode" (matches the requested format)
  const addrParts: string[] = [customer.address.trim()]
  if (customer.city?.trim()) addrParts.push(customer.city.trim())
  addrParts.push('Gujarat')
  const addrLine = addrParts.join(', ') + (customer.pincode?.trim() ? ` - ${customer.pincode.trim()}` : '')

  const lines: string[] = []
  lines.push(`New Order — ${settings.storeName}`)
  lines.push('')
  lines.push(`Name: ${customer.name}`)
  lines.push(`Mobile: ${customer.phone}`)
  lines.push(`Address: ${addrLine}`)
  lines.push('')
  lines.push('Order Details:')
  items.forEach((it) => {
    const guj = it.gujaratiName ? `${it.gujaratiName} (${it.name})` : it.name
    lines.push(`* ${guj} (${it.weight}) x${it.quantity} = ${formatINR(it.price * it.quantity)}`)
  })
  lines.push('')
  lines.push(`Total: ${formatINR(subtotal)}`)
  if (customer.notes?.trim()) {
    lines.push('')
    lines.push(`Notes: ${customer.notes.trim()}`)
  }
  lines.push('')
  lines.push('Please confirm my order')

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
