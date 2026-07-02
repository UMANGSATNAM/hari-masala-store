'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Store, MessageCircle, Image as ImageIcon, Lock, Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api-client'
import type { Settings } from '@/lib/types'
import { toast } from 'sonner'

export function AdminSettings({
  settings,
  onSaved,
}: {
  settings: Settings
  onSaved: (s: Settings) => void
}) {
  const [form, setForm] = useState({
    storeName: settings.storeName,
    storeTagline: settings.storeTagline,
    whatsappNumber: settings.whatsappNumber,
    freeShipThreshold: String(settings.freeShipThreshold),
    announcement: settings.announcement || '',
    heroImage: settings.heroImage || '',
    adminPin: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm({
      storeName: settings.storeName,
      storeTagline: settings.storeTagline,
      whatsappNumber: settings.whatsappNumber,
      freeShipThreshold: String(settings.freeShipThreshold),
      announcement: settings.announcement || '',
      heroImage: settings.heroImage || '',
      adminPin: '',
    })
  }, [settings])

  const save = async () => {
    setSaving(true)
    try {
      const payload: Record<string, unknown> = {
        storeName: form.storeName,
        storeTagline: form.storeTagline,
        whatsappNumber: form.whatsappNumber.replace(/\D/g, ''),
        freeShipThreshold: Number(form.freeShipThreshold),
        announcement: form.announcement || null,
        heroImage: form.heroImage || null,
      }
      if (form.adminPin) payload.adminPin = form.adminPin
      const { settings: updated } = await api.updateSettings(payload)
      onSaved(updated)
      setForm((f) => ({ ...f, adminPin: '' }))
      toast.success('Settings saved')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your store details, WhatsApp number & more</p>
      </div>

      {/* Store info */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Store className="h-4 w-4 text-primary" /> Store Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>Store Name</Label>
            <Input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} />
          </div>
          <div className="grid gap-1.5">
            <Label>Tagline</Label>
            <Input value={form.storeTagline} onChange={(e) => setForm({ ...form, storeTagline: e.target.value })} />
          </div>
          <div className="grid gap-1.5">
            <Label className="flex items-center gap-1.5"><Megaphone className="h-3.5 w-3.5" /> Announcement Bar</Label>
            <Input value={form.announcement} onChange={(e) => setForm({ ...form, announcement: e.target.value })} placeholder="e.g. Free delivery above ₹499" />
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp & delivery */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-green-600" /> WhatsApp & Delivery
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>WhatsApp Number (with country code, no +)</Label>
            <Input
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              placeholder="e.g. 919879873113"
            />
            <p className="text-xs text-muted-foreground">Orders will be sent to this number.</p>
          </div>
          <div className="grid gap-1.5">
            <Label>Free Delivery Threshold (₹)</Label>
            <Input
              type="number"
              value={form.freeShipThreshold}
              onChange={(e) => setForm({ ...form, freeShipThreshold: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Hero image */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-primary" /> Hero Banner Image
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>Image URL</Label>
            <Input value={form.heroImage} onChange={(e) => setForm({ ...form, heroImage: e.target.value })} placeholder="https://…" />
          </div>
          {form.heroImage && (
             
            <img src={form.heroImage} alt="hero preview" className="h-32 w-full object-cover rounded-lg border border-border" />
          )}
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" /> Security
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>Change Admin PIN (leave blank to keep current)</Label>
            <Input
              type="password"
              inputMode="numeric"
              value={form.adminPin}
              onChange={(e) => setForm({ ...form, adminPin: e.target.value })}
              placeholder="New PIN"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving} className="bg-spice-gradient hover:opacity-90 h-11 px-6">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Settings
        </Button>
      </div>
    </div>
  )
}
