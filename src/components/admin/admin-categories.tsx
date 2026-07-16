'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, FolderTree, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { api } from '@/lib/api-client'
import { CategorySvgIcon, COMMON_SVG_ICONS } from '@/components/ui/category-svg-icon'
import type { Category } from '@/lib/types'

export function AdminCategories({
  categories,
  onUpdate,
}: {
  categories: Category[]
  onUpdate: (cats: Category[]) => void
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '', icon: 'chilli', sortOrder: 0 })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', icon: 'chilli', sortOrder: categories.length + 1 })
    setDialogOpen(true)
  }

  const openEdit = (c: Category) => {
    setEditing(c)
    setForm({ name: c.name, icon: c.icon || 'chilli', sortOrder: c.sortOrder })
    setDialogOpen(true)
  }

  const save = async () => {
    if (!form.name.trim()) {
      toast.error('Category name is required')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        const { category } = await api.updateCategory(editing.id, {
          name: form.name.trim(),
          icon: form.icon || 'chilli',
          sortOrder: Number(form.sortOrder) || 0,
        })
        onUpdate(categories.map((c) => (c.id === editing.id ? { ...category, _count: (c as any)._count } : c)))
        toast.success('Category updated successfully')
      } else {
        const { category } = await api.createCategory({
          name: form.name.trim(),
          icon: form.icon || 'chilli',
          sortOrder: Number(form.sortOrder) || categories.length + 1,
        })
        onUpdate([...categories, category])
        toast.success('Category created successfully')
      }
      setDialogOpen(false)
    } catch (e: any) {
      toast.error(e?.message || 'Failed to save category')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      await api.deleteCategory(deleteId)
      onUpdate(categories.filter((c) => c.id !== deleteId))
      toast.success('Category deleted successfully')
    } catch {
      toast.error('Failed to delete category. Make sure it has no active products first.')
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Categories</h2>
          <p className="text-sm text-muted-foreground">
            Organize your spices & products into categories with custom icons and sorting
          </p>
        </div>
        <Button onClick={openCreate} className="bg-primary-gradient hover:opacity-90">
          <Plus className="h-4 w-4 mr-1.5" /> Add Category
        </Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left font-semibold px-4 py-3">Icon</th>
              <th className="text-left font-semibold px-4 py-3">Category Name</th>
              <th className="text-left font-semibold px-4 py-3">Slug</th>
              <th className="text-center font-semibold px-4 py-3">Products</th>
              <th className="text-center font-semibold px-4 py-3">Sort Order</th>
              <th className="text-right font-semibold px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  <FolderTree className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No categories created yet. Click "Add Category" above to create one.
                </td>
              </tr>
            ) : (
              categories.map((c) => (
                <tr key={c.id} className="hover:bg-accent/30">
                  <td className="px-4 py-3"><CategorySvgIcon category={c} className="h-5 w-5 text-primary" /></td>
                  <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{c.slug}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                      {(c as any)._count?.products ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{c.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(c)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(c.id)}>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Category' : 'Create New Category'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update your category details below.' : 'Add a new category for grouping spice products.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label>Category Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Blended Masalas, Whole Spices"
                autoFocus
              />
            </div>

            <div className="grid gap-1.5">
              <Label>Icon (Premium SVG Vector) *</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="e.g. chilli, masala, star..."
                  className="w-40 font-mono text-sm"
                />
                <span className="text-xs text-muted-foreground">Pick a vector icon below:</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1 max-h-48 overflow-y-auto pr-1">
                {COMMON_SVG_ICONS.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setForm({ ...form, icon: item.id })}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition-colors ${
                        form.icon === item.id ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm' : 'border-border hover:bg-accent text-muted-foreground'
                      }`}
                    >
                      <IconComponent className="h-5 w-5 mb-1" />
                      <span className="truncate w-full text-center">{item.id}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })}
                placeholder="1, 2, 3..."
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving} className="bg-primary-gradient hover:opacity-90">
              {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : null}
              {editing ? 'Save Changes' : 'Create Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this category?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? Products linked to this category may need to be reassigned.
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
    </div>
  )
}
