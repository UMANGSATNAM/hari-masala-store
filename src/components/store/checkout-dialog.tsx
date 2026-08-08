'use client'

import { useState } from 'react'
import { MessageCircle, Loader2, CheckCircle2, ShoppingCart } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCart } from '@/lib/store'
import { api } from '@/lib/api-client'
import { formatINR, buildWhatsAppOrder, calculateDeliveryCharge } from '@/lib/format'
import type { Settings } from '@/lib/types'
import { toast } from 'sonner'

export function CheckoutDialog({
  open,
  onOpenChange,
  settings,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  settings: Settings
}) {
  const { items, subtotal, clear, setOpen: setCartOpen } = useCart()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: 'Gujarat',
    pincode: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const total = subtotal()
  const isMumbai = form.state === 'Maharashtra' && form.city.trim().toLowerCase() === 'mumbai'
  const hasKnownDeliveryCharge = form.state === 'Gujarat' || isMumbai
  const deliveryCharge = hasKnownDeliveryCharge ? calculateDeliveryCharge(items, form.state, form.city) : undefined
  const finalTotal = deliveryCharge !== undefined ? total + deliveryCharge : total

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const valid =
    form.name.trim() &&
    /^\d{10}$/.test(form.phone.replace(/\D/g, '').slice(-10)) &&
    form.address.trim()

  const handleSubmit = async () => {
    if (!valid) {
      toast.error('Please fill name, a 10-digit phone and address.')
      return
    }
    setLoading(true)
    try {
      const orderItems = items.map((i) => ({
        id: i.id,
        name: i.name,
        gujaratiName: i.gujaratiName,
        price: i.price,
        quantity: i.quantity,
        weight: i.weight,
      }))

      const { order } = await api.createOrder({
        customerName: form.name.trim(),
        customerPhone: form.phone.trim(),
        customerAddress: form.address.trim(),
        customerCity: form.city.trim() || undefined,
        customerPincode: form.pincode.trim() || undefined,
        notes: form.notes.trim() || undefined,
        items: orderItems,
      })

      const { url } = buildWhatsAppOrder({
        items,
        subtotal: total,
        settings,
        orderNumber: order.orderNumber,
        customer: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
          notes: form.notes.trim(),
        },
        deliveryCharge,
      })

      window.open(url, '_blank', 'noopener,noreferrer')
      setDone(true)
      clear()
      setCartOpen(false)
      toast.success('Order placed! Opening WhatsApp to confirm…')
    } catch (e) {
      console.error(e)
      toast.error('Could not place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = (v: boolean) => {
    onOpenChange(v)
    if (!v && done) {
      setDone(false)
      setForm({ name: '', phone: '', address: '', city: '', state: 'Gujarat', pincode: '', notes: '' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex flex-col gap-0 p-0 w-[95vw] h-[90dvh] sm:h-auto sm:w-full sm:max-w-lg sm:max-h-[90dvh] overflow-hidden rounded-xl">
        <DialogHeader className="px-4 py-4 sm:px-6 border-b border-border shrink-0 bg-background/95 backdrop-blur z-10 rounded-t-xl">
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            {done ? 'Order Placed!' : 'Checkout — Order on WhatsApp'}
          </DialogTitle>
          <DialogDescription>
            {done
              ? 'Your order has been recorded. Confirm it on WhatsApp to complete.'
              : 'Fill in your details. Your order will be sent on WhatsApp.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
          {done ? (
            <div className="flex flex-col items-center text-center py-6">
            <CheckCircle2 className="h-16 w-16 text-green-600 mb-3" />
            <p className="font-semibold text-lg text-foreground">Thank you for your order!</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              We&apos;ve opened WhatsApp with your order details. Just hit send to
              confirm. Our team will reach out shortly.
            </p>
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-green-700 font-medium text-sm hover:underline"
            >
              <MessageCircle className="h-4 w-4" /> Open WhatsApp again
            </a>
            <Button onClick={() => handleClose(false)} className="mt-5 bg-primary-gradient hover:opacity-90">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Order summary */}
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Order Summary
              </p>
              <ul className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin">
                {items.map((i) => (
                  <li key={i.id} className="flex justify-between text-sm">
                    <span className="truncate pr-2" lang="gu">
                      {i.gujaratiName ? `${i.gujaratiName} (${i.name})` : i.name} <span className="text-muted-foreground">× {i.quantity}</span>
                    </span>
                    <span className="font-medium shrink-0">{formatINR(i.price * i.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 pt-2 border-t border-border flex justify-between font-bold">
                <span>Subtotal</span>
                <span>{formatINR(total)}</span>
              </div>
              {hasKnownDeliveryCharge && deliveryCharge !== undefined && (
                <div className="flex justify-between text-sm mt-1 font-medium">
                  <span>Delivery Charge</span>
                  <span>{formatINR(deliveryCharge)}</span>
                </div>
              )}
              {!hasKnownDeliveryCharge && (
                <div className="text-xs text-muted-foreground mt-1">
                  * Other state delivery charge will be given in WhatsApp after order.
                </div>
              )}
              <div className="mt-2 pt-2 border-t border-border flex justify-between font-bold text-primary text-lg">
                <span>Total</span>
                <span>{hasKnownDeliveryCharge && deliveryCharge !== undefined ? formatINR(finalTotal) : formatINR(total)}</span>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" value={form.name} onChange={set('name')} placeholder="e.g. Rahul Sharma" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="phone">Phone (WhatsApp) *</Label>
                  <Input id="phone" inputMode="numeric" value={form.phone} onChange={set('phone')} placeholder="10-digit number" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input id="pincode" value={form.pincode} onChange={set('pincode')} placeholder="e.g. 380015" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="address">Delivery Address *</Label>
                <Textarea id="address" value={form.address} onChange={set('address')} rows={2} placeholder="House no, street, area, landmark…" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={form.city} onChange={set('city')} placeholder="e.g. Ahmedabad" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="state">State *</Label>
                  <Select value={form.state} onValueChange={(v) => setForm(f => ({ ...f, state: v }))}>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {[
                        "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", 
                        "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", 
                        "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", 
                        "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", 
                        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", 
                        "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
                        "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
                      ].map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="notes">Order Notes (optional)</Label>
                <Textarea id="notes" value={form.notes} onChange={set('notes')} rows={2} placeholder="Any special instructions…" />
              </div>
            </div>
          </>
          )}
        </div>

        {!done && (
          <DialogFooter className="px-4 py-4 sm:px-6 gap-2 sm:gap-2 border-t border-border shrink-0 bg-background/95 backdrop-blur rounded-b-xl flex-col sm:flex-row">
            <Button variant="outline" onClick={() => handleClose(false)} disabled={loading} className="w-full sm:w-auto">
              Cancel
            </Button>
              <Button
                onClick={handleSubmit}
                disabled={!valid || loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Placing…
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4 mr-2" /> Place Order on WhatsApp
                  </>
                )}
              </Button>
            </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
