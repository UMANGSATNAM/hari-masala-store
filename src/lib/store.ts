'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from './types'

type CartState = {
  items: CartItem[]
  isOpen: boolean
  setOpen: (open: boolean) => void
  add: (product: Product, quantity?: number) => void
  remove: (id: string) => void
  setQty: (id: string, quantity: number) => void
  clear: () => void
  count: () => number
  subtotal: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),
      add: (product, quantity = 1) => {
        const items = get().items
        const existing = items.find((i) => i.id === product.id)
        if (existing) {
          const newQty = Math.min(existing.quantity + quantity, product.stock)
          set({
            items: items.map((i) =>
              i.id === product.id ? { ...i, quantity: newQty } : i
            ),
            isOpen: true,
          })
        } else {
          set({
            items: [
              ...items,
              {
                id: product.id,
                name: product.name,
                gujaratiName: product.gujaratiName,
                slug: product.slug,
                price: product.price,
                mrp: product.mrp,
                weight: product.weight,
                image: product.image,
                quantity: Math.min(quantity, product.stock),
                stock: product.stock,
              },
            ],
            isOpen: true,
          })
        }
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      setQty: (id, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.id !== id) })
          return
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i
          ),
        })
      },
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'hari-masala-cart' }
  )
)

type AdminState = {
  isAuthed: boolean
  login: () => void
  logout: () => void
}

export const useAdmin = create<AdminState>()(
  persist(
    (set) => ({
      isAuthed: false,
      login: () => set({ isAuthed: true }),
      logout: () => set({ isAuthed: false }),
    }),
    { name: 'hari-masala-admin' }
  )
)
