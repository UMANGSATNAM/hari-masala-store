'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Plus, Pencil, Trash2, Search, Loader2, Star, StarOff, PackageX, IndianRupee, Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { api } from '@/lib/api-client'
import { formatINR, discountPercent } from '@/lib/format'
import { CategorySvgIcon, COMMON_SVG_ICONS } from '@/components/ui/category-svg-icon'
import type { Category, Product } from '@/lib/types'
import { toast } from 'sonner'

type FormState = {
  name: string; gujaratiName: string; description: string; price: string; mrp: string
  weight: string; categoryId: string; image: string; stock: string; featured: boolean
  active: boolean; rating: string
}

const emptyForm: FormState = {
  name: '', gujaratiName: '', description: '', price: '', mrp: '', weight: '100g',
  categoryId: '', image: '', stock: '50', featured: false, active: true, rating: '4.5',
}

export function AdminProducts({ categories, onCategoryAdded }: { categories: Category[]; onCategoryAdded?: (cat: Category) => void }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [priceEdit, setPriceEdit] = useState<{ id: string; value: string } | null>(null)
  const [uploading, setUploading] = useState(false)

  const [quickCatOpen, setQuickCatOpen] = useState(false)
  const [quickCatName, setQuickCatName] = useState('')
  const [quickCatIcon, setQuickCatIcon] = useState('chilli')
  const [quickCatSaving, setQuickCatSaving] = useState(false)

  const handleQuickCreateCategory = async () => {
    if (!quickCatName.trim()) {
      toast.error('Category name is required')
      return
    }
    setQuickCatSaving(true)
    try {
      const { category } = await api.createCategory({
        name: quickCatName.trim(),
        icon: quickCatIcon || 'chilli',
        sortOrder: categories.length + 1,
      })
      onCategoryAdded?.(category)
      setForm((f) => ({ ...f, categoryId: category.id }))
      toast.success(`Category "${category.name}" created and selected!`)
      setQuickCatOpen(false)
      setQuickCatName('')
    } catch (e: any) {
      toast.error(e?.message || 'Failed to create category')
    } finally {
      setQuickCatSaving(false)
    }
  }

  // Handle image file upload — POSTs to /api/products which handles multipart uploads
  const handleImageUpload = async (file: File) => {
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/products', { method: 'POST', body: fd })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as { error?: string }).error || 'Upload failed')
      }
      const data = (await res.json()) as { url: string }
      setForm((f) => ({ ...f, image: data.url }))
      toast.success('Image uploaded')
    } catch (e) {
      console.error(e)
      toast.error(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { products } = await api.getProducts({ category: 'all' })
      // admin sees all, including inactive
      setProducts(products)
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  // load all products (including inactive) — re-fetch raw via a dedicated admin fetch
  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products?category=all')
      const data = await res.json()
      setProducts(data.products || [])
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.gujaratiName || '').toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, categoryId: categories[0]?.id || '' })
    setDialogOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({
      name: p.name, gujaratiName: p.gujaratiName || '', description: p.description,
      price: String(p.price), mrp: String(p.mrp), weight: p.weight,
      categoryId: p.categoryId, image: p.image, stock: String(p.stock),
      featured: p.featured, active: p.active, rating: String(p.rating),
    })
    setDialogOpen(true)
  }

  const save = async () => {
    if (!form.name || !form.description || !form.price || !form.categoryId || !form.image) {
      toast.error('Please fill all required fields (name, description, price, category, image)')
      return
    }
    setSaving(true)
    try {
      const payload = {
        name: form.name, gujaratiName: form.gujaratiName || null, description: form.description,
        price: Number(form.price), mrp: Number(form.mrp) || Number(form.price),
        weight: form.weight, categoryId: form.categoryId, image: form.image,
        stock: Number(form.stock), featured: form.featured, active: form.active,
        rating: Number(form.rating) || 4.5,
      }
      if (editing) {
        const { product } = await api.updateProduct(editing.id, payload)
        setProducts((arr) => arr.map((p) => (p.id === editing.id ? product : p)))
        toast.success('Product updated')
      } else {
        const { product } = await api.createProduct(payload)
        setProducts((arr) => [product, ...arr])
        toast.success('Product created')
      }
      setDialogOpen(false)
    } catch (e) {
      console.error(e)
      toast.error('Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      await api.deleteProduct(deleteId)
      setProducts((arr) => arr.filter((p) => p.id !== deleteId))
      toast.success('Product deleted')
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleteId(null)
    }
  }

  const toggleFeatured = async (p: Product) => {
    try {
      const { product } = await api.updateProduct(p.id, { featured: !p.featured })
      setProducts((arr) => arr.map((x) => (x.id === p.id ? product : x)))
    } catch {
      toast.error('Failed to update')
    }
  }

  const toggleActive = async (p: Product) => {
    try {
      const { product } = await api.updateProduct(p.id, { active: !p.active })
      setProducts((arr) => arr.map((x) => (x.id === p.id ? product : x)))
    } catch {
      toast.error('Failed to update')
    }
  }

  const savePrice = async (id: string) => {
    if (!priceEdit) return
    const newPrice = Number(priceEdit.value)
    if (isNaN(newPrice) || newPrice < 0) {
      toast.error('Invalid price')
      setPriceEdit(null)
      return
    }
    try {
      const { product } = await api.updateProduct(id, { price: newPrice })
      setProducts((arr) => arr.map((x) => (x.id === id ? product : x)))
      toast.success('Price updated')
    } catch {
      toast.error('Failed to update price')
    } finally {
      setPriceEdit(null)
    }
  }

  const catName = (id: string) => categories.find((c) => c.id === id)?.name || '—'

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Products</h2>
          <p className="text-sm text-muted-foreground">
            Manage your spice catalog — edit prices, stock & details
          </p>
        </div>
        <Button onClick={openCreate} className="bg-primary-gradient hover:opacity-90">
          <Plus className="h-4 w-4 mr-1.5" /> Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="pl-9"
        />
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left font-semibold px-4 py-3">Product</th>
              <th className="text-left font-semibold px-4 py-3">Category</th>
              <th className="text-left font-semibold px-4 py-3">Price (₹)</th>
              <th className="text-left font-semibold px-4 py-3">MRP</th>
              <th className="text-left font-semibold px-4 py-3">Stock</th>
              <th className="text-center font-semibold px-4 py-3">Featured</th>
              <th className="text-center font-semibold px-4 py-3">Active</th>
              <th className="text-right font-semibold px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={8} className="px-4 py-3"><Skeleton className="h-10 w-full" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                  <PackageX className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No products found
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-accent/30">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      { }
                      <img src={p.image} alt={p.name} className="h-10 w-10 rounded-md object-cover border border-border" />
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate max-w-[180px]" lang="gu">{p.gujaratiName || p.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{p.name} · {p.weight}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{catName(p.categoryId)}</td>
                  <td className="px-4 py-2.5">
                    {priceEdit?.id === p.id ? (
                      <Input
                        autoFocus
                        type="number"
                        value={priceEdit.value}
                        onChange={(e) => setPriceEdit({ id: p.id, value: e.target.value })}
                        onBlur={() => savePrice(p.id)}
                        onKeyDown={(e) => { if (e.key === 'Enter') savePrice(p.id); if (e.key === 'Escape') setPriceEdit(null); }}
                        className="h-8 w-20"
                      />
                    ) : (
                      <button
                        onClick={() => setPriceEdit({ id: p.id, value: String(p.price) })}
                        className="font-semibold text-primary hover:underline inline-flex items-center"
                        title="Click to edit price"
                      >
                        <IndianRupee className="h-3 w-3" />{p.price}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground line-through">{p.mrp}</td>
                  <td className="px-4 py-2.5">
                    <span className={p.stock < 15 ? 'text-red-600 font-semibold' : 'text-foreground'}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <button onClick={() => toggleFeatured(p)} className="inline-flex">
                      {p.featured ? (
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ) : (
                        <StarOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <Switch checked={p.active} onCheckedChange={() => toggleActive(p)} />
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(p.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <PackageX className="h-8 w-8 mx-auto mb-2 opacity-50" /> No products found
          </div>
        ) : (
          filtered.map((p) => (
            <div key={p.id} className="rounded-xl border border-border p-3 bg-card">
              <div className="flex gap-3">
                { }
                <img src={p.image} alt={p.name} className="h-14 w-14 rounded-md object-cover border border-border" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-foreground truncate" lang="gu">{p.gujaratiName || p.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{p.name} · {p.weight}</p>
                    </div>
                    {p.featured && <Badge className="bg-saffron-gradient text-secondary-foreground text-[10px]">★</Badge>}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {priceEdit?.id === p.id ? (
                        <Input
                          autoFocus type="number" value={priceEdit.value}
                          onChange={(e) => setPriceEdit({ id: p.id, value: e.target.value })}
                          onBlur={() => savePrice(p.id)}
                          onKeyDown={(e) => { if (e.key === 'Enter') savePrice(p.id); if (e.key === 'Escape') setPriceEdit(null); }}
                          className="h-7 w-20"
                        />
                      ) : (
                        <button onClick={() => setPriceEdit({ id: p.id, value: String(p.price) })} className="font-bold text-primary">
                          {formatINR(p.price)}
                        </button>
                      )}
                      <span className="text-xs text-muted-foreground line-through">{formatINR(p.mrp)}</span>
                      <span className={`text-xs ${p.stock < 15 ? 'text-red-600 font-semibold' : 'text-muted-foreground'}`}>
                        · {p.stock} in stock
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(p.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[92vh] overflow-y-auto scrollbar-thin">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update the product details below.' : 'Fill in the details for the new spice product.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            {form.image && (
              <img src={form.image} alt="preview" className="h-32 w-full object-cover rounded-lg border border-border" />
            )}
            <div className="grid gap-1.5">
              <Label>Product Image *</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="Paste image URL or upload below…"
                  className="flex-1"
                />
                <label className="inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap rounded-md bg-primary-gradient text-primary-foreground hover:opacity-90 h-9 px-3 text-sm font-medium">
                  {uploading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</>
                  ) : (
                    <><Upload className="h-4 w-4" /> Upload Image</>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleImageUpload(f)
                      e.target.value = ''
                    }}
                  />
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                Upload a product photo (JPG/PNG/WEBP, max 5MB) or paste an image URL.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Turmeric Powder" />
              </div>
              <div className="grid gap-1.5">
                <Label>Gujarati Name</Label>
                <Input value={form.gujaratiName} onChange={(e) => setForm({ ...form, gujaratiName: e.target.value })} placeholder="e.g. હળદર" lang="gu" />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>Description *</Label>
              <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the spice…" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-1.5">
                <Label>Price (₹) *</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label>MRP (₹)</Label>
                <Input type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label>Stock</Label>
                <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Weight</Label>
                <Input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="e.g. 200g" />
              </div>
              <div className="grid gap-1.5">
                <Label>Rating</Label>
                <Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-1.5">
              <div className="flex items-center justify-between">
                <Label>Category *</Label>
                <button
                  type="button"
                  onClick={() => { setQuickCatName(''); setQuickCatOpen(true) }}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> New Category
                </button>
              </div>
              <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <span className="flex items-center gap-2">
                        <CategorySvgIcon category={c} className="h-4 w-4 text-primary shrink-0" />
                        {c.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
                Active (visible)
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving} className="bg-primary-gradient hover:opacity-90">
              {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : null}
              {editing ? 'Save Changes' : 'Create Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The product will be permanently removed from your store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Quick category creation modal inside product form */}
      <Dialog open={quickCatOpen} onOpenChange={setQuickCatOpen}>
        <DialogContent className="max-w-sm z-50">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a category quickly without leaving your product form.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label>Category Name *</Label>
              <Input
                value={quickCatName}
                onChange={(e) => setQuickCatName(e.target.value)}
                placeholder="e.g. Blended Masalas"
                autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') handleQuickCreateCategory() }}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Icon (Vector Key)</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={quickCatIcon}
                  onChange={(e) => setQuickCatIcon(e.target.value)}
                  placeholder="chilli"
                  className="w-28 font-mono text-xs"
                />
                <span className="text-xs text-muted-foreground">Pick:</span>
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {COMMON_SVG_ICONS.slice(0, 6).map((item) => {
                  const IconComp = item.icon
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setQuickCatIcon(item.id)}
                      className={`p-1.5 rounded border transition-colors ${
                        quickCatIcon === item.id ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-accent'
                      }`}
                      title={item.label}
                    >
                      <IconComp className="h-4 w-4" />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setQuickCatOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleQuickCreateCategory} disabled={quickCatSaving} className="bg-primary-gradient hover:opacity-90">
              {quickCatSaving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : null}
              Create & Select
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
