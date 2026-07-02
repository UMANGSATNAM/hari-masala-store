import type { Category, Order, Product, Settings } from './types'

async function jfetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error || `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export const api = {
  getProducts: (params: { category?: string; search?: string; featured?: boolean } = {}) => {
    const q = new URLSearchParams()
    if (params.category) q.set('category', params.category)
    if (params.search) q.set('search', params.search)
    if (params.featured) q.set('featured', 'true')
    return jfetch<{ products: Product[] }>(`/api/products?${q.toString()}`)
  },
  createProduct: (data: Partial<Product>) =>
    jfetch<{ product: Product }>(`/api/products`, { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: string, data: Partial<Product>) =>
    jfetch<{ product: Product }>(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id: string) =>
    jfetch<{ ok: boolean }>(`/api/products/${id}`, { method: 'DELETE' }),

  getCategories: () => jfetch<{ categories: (Category & { _count?: { products: number } })[] }>(`/api/categories`),
  createCategory: (data: { name: string; icon?: string; sortOrder?: number }) =>
    jfetch<{ category: Category }>(`/api/categories`, { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: string, data: Partial<Category>) =>
    jfetch<{ category: Category }>(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: string) =>
    jfetch<{ ok: boolean }>(`/api/categories/${id}`, { method: 'DELETE' }),

  createOrder: (data: {
    customerName: string
    customerPhone: string
    customerAddress: string
    customerCity?: string
    customerPincode?: string
    notes?: string
    items: { id: string; name: string; hindiName: string | null; price: number; quantity: number; weight: string }[]
  }) => jfetch<{ order: Order }>(`/api/orders`, { method: 'POST', body: JSON.stringify(data) }),
  getOrders: (status?: string) => {
    const q = status && status !== 'all' ? `?status=${status}` : ''
    return jfetch<{ orders: Order[] }>(`/api/orders${q}`)
  },
  updateOrder: (id: string, data: { status?: string; notes?: string }) =>
    jfetch<{ order: Order }>(`/api/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteOrder: (id: string) =>
    jfetch<{ ok: boolean }>(`/api/orders/${id}`, { method: 'DELETE' }),

  getSettings: () => jfetch<{ settings: Settings }>(`/api/settings`),
  updateSettings: (data: Partial<Settings>) =>
    jfetch<{ settings: Settings }>(`/api/settings`, { method: 'PUT', body: JSON.stringify(data) }),

  verifyAdmin: (pin: string) =>
    jfetch<{ ok: boolean }>(`/api/admin/verify`, { method: 'POST', body: JSON.stringify({ pin }) }),

  getDashboard: () =>
    jfetch<{
      productCount: number
      orderCount: number
      pendingOrders: number
      lowStock: number
      totalRevenue: number
      recentOrders: Order[]
      categoryStats: (Category & { _count: { products: number } })[]
    }>(`/api/dashboard`),
}
