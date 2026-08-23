'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Store, MessageCircle, Image as ImageIcon, Lock, Megaphone, Plus, Trash2, Upload, FileText } from 'lucide-react'
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
  const parseHeroImages = (val: string | null) => {
    if (!val) return []
    try {
      const parsed = JSON.parse(val)
      return Array.isArray(parsed) ? parsed : [val]
    } catch {
      return [val]
    }
  }

  const [heroImages, setHeroImages] = useState<string[]>(parseHeroImages(settings.heroImage))

  const [form, setForm] = useState({
    storeName: settings.storeName,
    storeTagline: settings.storeTagline,
    whatsappNumber: settings.whatsappNumber,
    freeShipThreshold: String(settings.freeShipThreshold),
    announcement: settings.announcement || '',
    logoImage: settings.logoImage || '',
    priceListPdf: settings.priceListPdf || '',
    adminPin: '',
  })
  
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    setForm({
      storeName: settings.storeName,
      storeTagline: settings.storeTagline,
      whatsappNumber: settings.whatsappNumber,
      freeShipThreshold: String(settings.freeShipThreshold),
      announcement: settings.announcement || '',
      logoImage: settings.logoImage || '',
      priceListPdf: settings.priceListPdf || '',
      adminPin: '',
    })
    setHeroImages(parseHeroImages(settings.heroImage))
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
        logoImage: form.logoImage || null,
        priceListPdf: form.priceListPdf || null,
        heroImage: heroImages.length > 0 ? JSON.stringify(heroImages) : null,
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

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed')
      return
    }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/products', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      setForm((prev) => ({ ...prev, priceListPdf: data.url }))
      toast.success('Price List PDF uploaded & updated!')
    } catch (err) {
      toast.error('Failed to upload Price List PDF')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/products', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      setHeroImages((prev) => [...prev, data.url])
      toast.success('Media uploaded')
    } catch (err) {
      toast.error('Failed to upload hero image')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/products', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      setForm((prev) => ({ ...prev, logoImage: data.url }))
      toast.success('Store logo uploaded')
    } catch (err) {
      toast.error('Failed to upload store logo')
    } finally {
      setUploading(false)
      e.target.value = ''
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
            <Input value={form.announcement} onChange={(e) => setForm({ ...form, announcement: e.target.value })} placeholder="e.g. 10% off on first order" />
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
        </CardContent>
      </Card>

      {/* Store Logo */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base flex items-center gap-2">
            <Store className="h-4 w-4 text-primary" /> Store Logo
          </CardTitle>
          <div className="relative">
            <Button size="sm" variant="outline" disabled={uploading}>
              {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
              Upload Logo
            </Button>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={uploading}
            />
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          {form.logoImage && (
            <div className="relative group rounded-lg overflow-hidden border border-border mt-2 w-32 h-32 bg-muted/50 grid place-items-center p-2">
              <img src={form.logoImage} alt="logo preview" className="max-h-full max-w-full object-contain" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setForm((prev) => ({ ...prev, logoImage: '' }))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hero Banner Media */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-primary" /> Hero Banner Media
          </CardTitle>
          <div className="relative">
            <Button size="sm" variant="outline" disabled={uploading}>
              {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
              Upload Image/Video
            </Button>
            <input
              type="file"
              accept="image/*,video/mp4,video/webm"
              onChange={handleHeroUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={uploading}
            />
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          {heroImages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {heroImages.map((src, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden border border-border">
                  {src.match(/\.(mp4|webm)$/i) ? (
                    <video src={src} autoPlay loop muted playsInline className="h-32 w-full object-cover" />
                  ) : (
                    <img src={src} alt={`hero preview ${i}`} className="h-32 w-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setHeroImages(heroImages.filter((_, idx) => idx !== i))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Price List PDF Management */}
      <Card className="shadow-sm border-amber-500/30">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <FileText className="h-4 w-4 text-amber-600" /> Price List PDF Management
          </CardTitle>
          <div className="relative">
            <Button size="sm" variant="outline" className="border-amber-500/40 text-amber-800 dark:text-amber-300 hover:bg-amber-50" disabled={uploading}>
              {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
              Upload / Replace PDF
            </Button>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={uploading}
            />
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          <p className="text-xs text-muted-foreground">
            Upload or update your store price list PDF. Website visitors clicking "Download Our Price List" will automatically download this file.
          </p>

          <div className="grid gap-1.5">
            <Label className="text-xs">Direct PDF URL</Label>
            <Input
              value={form.priceListPdf}
              onChange={(e) => setForm({ ...form, priceListPdf: e.target.value })}
              placeholder="e.g. /Hari_Masala_Price_List.pdf or ImageKit URL"
              className="text-xs font-mono"
            />
          </div>

          {form.priceListPdf ? (
            <div className="flex items-center justify-between p-3 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 text-xs">
              <div className="flex items-center gap-2 truncate">
                <FileText className="h-4 w-4 text-amber-600 shrink-0" />
                <span className="font-semibold text-foreground truncate">{form.priceListPdf}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button size="sm" variant="outline" asChild className="h-7 text-xs">
                  <a href={form.priceListPdf} target="_blank" rel="noreferrer">
                    Preview PDF
                  </a>
                </Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => setForm({ ...form, priceListPdf: '' })}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-lg border border-dashed border-border text-center text-xs text-muted-foreground">
              Using default PDF (<code className="font-mono text-[11px]">/Hari_Masala_Price_List.pdf</code>). Upload a new file above to replace it.
            </div>
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
        <Button onClick={save} disabled={saving} className="bg-primary-gradient hover:opacity-90 h-11 px-6">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Settings
        </Button>
      </div>
    </div>
  )
}
