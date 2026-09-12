'use client'

import { useEffect } from 'react'
import { RefreshCw, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Hari Masala app error caught by boundary:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full p-6 text-center rounded-2xl border border-border bg-card shadow-lg space-y-4">
        <div className="h-14 w-14 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
          <RefreshCw className="h-7 w-7" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Something went wrong</h2>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            There was a temporary issue loading the page. You can try again or return to the storefront.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-primary text-primary-foreground font-semibold"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => { window.location.href = '/' }}
            className="w-full sm:w-auto"
          >
            <Store className="h-4 w-4 mr-2" /> Reload Store
          </Button>
        </div>
      </div>
    </div>
  )
}
