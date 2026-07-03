'use client'

import { useState } from 'react'
import { Lock, Loader2, ArrowLeft, Flame, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAdmin } from '@/lib/store'
import { api } from '@/lib/api-client'
import { toast } from 'sonner'

export function AdminGate({ onExit }: { onExit: () => void }) {
  const login = useAdmin((s) => s.login)
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pin) return
    setLoading(true)
    try {
      const res = await api.verifyAdmin(pin)
      if (res.ok) {
        login()
        toast.success('Welcome to the admin panel')
      } else {
        toast.error('Incorrect PIN. Try again.')
      }
    } catch {
      toast.error('Could not verify. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-accent/30 px-4">
      <div className="w-full max-w-sm">
        <button
          onClick={onExit}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to store
        </button>
        <div className="rounded-2xl border border-border bg-card p-7 shadow-lg">
          <div className="flex flex-col items-center text-center mb-6">
            <span className="grid place-items-center h-14 w-14 rounded-full bg-primary-gradient text-primary-foreground mb-3 shadow">
              <Flame className="h-7 w-7" />
            </span>
            <h1 className="text-xl font-bold text-foreground">Hari Masala Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your PIN to manage products & orders
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="pin" className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" /> Admin PIN
              </Label>
              <Input
                id="pin"
                type="password"
                inputMode="numeric"
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                className="text-center text-lg tracking-widest"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !pin}
              className="w-full bg-primary-gradient hover:opacity-90 h-11"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Verifying…</>
              ) : (
                <><ShieldCheck className="h-4 w-4 mr-2" /> Unlock Admin</>
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Demo PIN: <span className="font-mono font-semibold text-foreground">1234</span>
          </p>
        </div>
      </div>
    </div>
  )
}
