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
export function parseWeightToGrams(weight: string): number {
  const w = weight.toLowerCase().trim()
  const num = parseFloat(w.replace(/[^0-9.]/g, ''))
  if (isNaN(num)) return 0
  if (w.includes('kg')) return num * 1000
  return num
}

export function calculateDeliveryCharge(
  items: {weight: string, quantity: number}[],
  state?: string,
  city?: string
): number {
  let totalGrams = 0
  for (const item of items) {
    totalGrams += parseWeightToGrams(item.weight) * item.quantity
  }
  if (totalGrams === 0) return 0
  const totalKg = Math.ceil(totalGrams / 1000)
  
  if (state === 'Maharashtra' && city?.toLowerCase().trim() === 'mumbai') {
    return totalKg * 30
  }
  
  return totalKg * 20
}

export function buildWhatsAppOrder(args: {
  items: CartItem[]
  subtotal: number
  settings: Settings
  orderNumber?: string
  customer: {
    name: string
    phone: string
    address: string
    city?: string
    state: string
    pincode?: string
    notes?: string
  }
  deliveryCharge?: number
}): { text: string; url: string } {
  const { items, subtotal, settings, customer, deliveryCharge, orderNumber } = args

  // Address line: "address, city, state - pincode"
  const addrParts: string[] = [customer.address.trim()]
  if (customer.city?.trim()) addrParts.push(customer.city.trim())
  if (customer.state?.trim()) addrParts.push(customer.state.trim())
  const addrLine = addrParts.join(', ') + (customer.pincode?.trim() ? ` - ${customer.pincode.trim()}` : '')

  const lines: string[] = []
  lines.push(`New Order — ${settings.storeName}`)
  if (orderNumber) {
    lines.push(`Order ID: ${orderNumber}`)
  }
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
  const isMumbai = customer.state === 'Maharashtra' && customer.city?.toLowerCase().trim() === 'mumbai'
  const hasKnownDeliveryCharge = customer.state === 'Gujarat' || isMumbai
  if (hasKnownDeliveryCharge && deliveryCharge !== undefined) {
    lines.push(`Products Total: ${formatINR(subtotal)}`)
    lines.push(`Delivery Charge: ${formatINR(deliveryCharge)}`)
    lines.push(`Full Total: ${formatINR(subtotal + deliveryCharge)}`)
  } else if (!hasKnownDeliveryCharge) {
    lines.push(`Products Total: ${formatINR(subtotal)}`)
    lines.push('Other state delivery charge will be given in whatsapp after getting order')
  } else {
    lines.push(`Total: ${formatINR(subtotal)}`)
  }
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
