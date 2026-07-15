export type Category = {
  id: string
  name: string
  slug: string
  icon: string | null
  sortOrder: number
}

export type Product = {
  id: string
  name: string
  slug: string
  gujaratiName: string | null
  description: string
  price: number
  mrp: number
  weight: string
  categoryId: string
  category?: Category
  image: string
  stock: number
  featured: boolean
  active: boolean
  rating: number
  createdAt: string
  updatedAt: string
}

export type CartItem = {
  id: string
  name: string
  gujaratiName: string | null
  slug: string
  price: number
  mrp: number
  weight: string
  image: string
  quantity: number
  stock: number
}

export type OrderItem = {
  id: string
  name: string
  gujaratiName: string | null
  price: number
  quantity: number
  weight: string
}

export type Order = {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerAddress: string
  customerCity: string | null
  customerPincode: string | null
  items: string
  itemCount: number
  subtotal: number
  total: number
  status: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export type Settings = {
  id: string
  storeName: string
  storeTagline: string
  whatsappNumber: string
  freeShipThreshold: number
  adminPin: string
  heroImage: string | null
  announcement: string | null
}

export const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]
