import type { Order, OrderItem } from './types'
import { calculateDeliveryCharge } from './format'

export function parseOrderItems(order: Order): OrderItem[] {
  let items: any = order.items
  if (typeof items === 'string') {
    try {
      items = JSON.parse(items)
    } catch {
      return []
    }
  }
  if (typeof items === 'string') {
    try {
      items = JSON.parse(items)
    } catch {
      return []
    }
  }
  return Array.isArray(items) ? items : []
}

export function getOrderDeliveryCharge(order: Order): number {
  if (typeof order.deliveryCharge === 'number' && order.deliveryCharge > 0) {
    return order.deliveryCharge
  }
  if (order.total > order.subtotal) {
    return Math.round(order.total - order.subtotal)
  }
  const cityStr = (order.customerCity || '').toLowerCase().trim()
  const addrStr = (order.customerAddress || '').toLowerCase().trim()
  const isMumbai = cityStr.includes('mumbai') || addrStr.includes('mumbai')
  const state = isMumbai ? 'Maharashtra' : (order.customerState || 'Gujarat')
  const city = isMumbai ? 'mumbai' : (order.customerCity || '')
  const items = parseOrderItems(order)
  return calculateDeliveryCharge(items, state, city)
}

export function getFullOrderTotal(order: Order): number {
  const delivery = getOrderDeliveryCharge(order)
  if (order.total > order.subtotal) {
    return order.total
  }
  return order.subtotal + delivery
}

export function formatOrderDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return dateStr
  }
}
