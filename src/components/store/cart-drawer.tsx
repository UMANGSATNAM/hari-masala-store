'use client'

import { Minus, Plus, Trash2, ShoppingBag, X, Truck, Sparkles } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/lib/store'
import { formatINR } from '@/lib/format'
import type { Settings } from '@/lib/types'

export function CartDrawer({
  settings,
  onCheckout,
}: {
  settings: Settings
  onCheckout: () => void
}) {
  const { items, isOpen, setOpen, setQty, remove, subtotal, clear } = useCart()
  const total = subtotal()
  const threshold = settings.freeShipThreshold
  const remaining = Math.max(0, threshold - total)
  const progress = Math.min(100, (total / threshold) * 100)

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 gap-0">
        <SheetHeader className="px-4 py-4 border-b border-border bg-primary-gradient text-primary-foreground">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-primary-foreground">
              <ShoppingBag className="h-5 w-5" /> Your Cart
            </SheetTitle>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md p-1 hover:bg-white/20"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </SheetHeader>



        {/* Items */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
              <div className="grid place-items-center h-16 w-16 rounded-full bg-muted mb-4">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add some delicious spices to get started!
              </p>
              <Button
                onClick={() => setOpen(false)}
                className="mt-5 bg-primary-gradient hover:opacity-90"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((it) => (
                <li key={it.id} className="flex gap-3 p-4">
                  { }
                  <img
                    src={it.image}
                    alt={it.name}
                    className="h-16 w-16 rounded-lg object-cover border border-border shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-foreground truncate" lang="gu">
                          {it.gujaratiName || it.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {it.gujaratiName ? it.name : ''} {it.gujaratiName ? '·' : ''} {it.weight}
                        </p>
                      </div>
                      <button
                        onClick={() => remove(it.id)}
                        className="text-muted-foreground hover:text-destructive p-1"
                        aria-label={`Remove ${it.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-md border border-border">
                        <button
                          onClick={() => setQty(it.id, it.quantity - 1)}
                          className="grid place-items-center h-7 w-7 hover:bg-accent"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {it.quantity}
                        </span>
                        <button
                          onClick={() => setQty(it.id, it.quantity + 1)}
                          disabled={it.quantity >= it.stock}
                          className="grid place-items-center h-7 w-7 hover:bg-accent disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-semibold text-sm text-primary">
                        {formatINR(it.price * it.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <SheetFooter className="border-t border-border p-4 gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">{formatINR(total)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Delivery</span>
              <span className="font-semibold text-primary">Calculated at checkout</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg text-primary">{formatINR(total)}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clear}
                className="text-destructive hover:text-destructive"
              >
                Clear
              </Button>
              <Button
                onClick={onCheckout}
                className="flex-1 bg-primary-gradient hover:opacity-90 h-11"
              >
                <ShoppingBag className="h-4 w-4 mr-2" /> Checkout via WhatsApp
              </Button>
            </div>
            <p className="text-[11px] text-center text-muted-foreground">
              No online payment. Pay cash on delivery. Order sent on WhatsApp.
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
