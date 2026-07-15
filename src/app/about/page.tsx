'use client'

import { useEffect, useState } from 'react'
import { AboutView } from '@/components/store/about-view'
import { api } from '@/lib/api-client'
import type { Settings } from '@/lib/types'

export default function AboutPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getSettings()
      .then((res) => setSettings(res.settings))
      .catch((e) => console.error('About page settings load error:', e))
      .finally(() => setLoading(false))
  }, [])

  if (loading || !settings) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading Hari Masala Heritage…</p>
        </div>
      </div>
    )
  }

  return <AboutView settings={settings} />
}
