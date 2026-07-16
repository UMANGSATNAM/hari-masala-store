'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AdminGate } from '@/components/admin/admin-gate'
import { AdminApp } from '@/components/admin/admin-app'
import { api } from '@/lib/api-client'
import { useAdmin } from '@/lib/store'
import type { Category, Settings } from '@/lib/types'

export default function AdminRoutePage() {
  const router = useRouter()
  const isAuthed = useAdmin((s) => s.isAuthed)

  const [settings, setSettings] = useState<Settings | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getSettings(), api.getCategories()])
      .then(([s, c]) => {
        setSettings(s.settings)
        setCategories(c.categories)
      })
      .catch((e) => console.error('Admin load error:', e))
      .finally(() => setLoading(false))
  }, [])

  const goToStore = useCallback(() => {
    router.push('/')
  }, [router])

  if (loading || !settings) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading Admin Portal…</p>
        </div>
      </div>
    )
  }

  if (!isAuthed) {
    return <AdminGate onExit={goToStore} />
  }

  return (
    <AdminApp
      settings={settings}
      categories={categories}
      onExit={goToStore}
      onSettingsSaved={(s) => setSettings(s)}
      onCategoriesChanged={(cats) => setCategories(cats)}
    />
  )
}
