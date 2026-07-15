'use client'

import { MessageCircle } from 'lucide-react'
import type { Settings } from '@/lib/types'

export function WhatsAppFloatingButton({ settings }: { settings?: Settings | null }) {
  if (!settings?.whatsappNumber) return null

  const phone = settings.whatsappNumber
  const text = encodeURIComponent('Namaste Hari Masala! I have an inquiry regarding your authentic spices.')

  return (
    <a
      href={`https://wa.me/${phone}?text=${text}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 rounded-full bg-green-600 hover:bg-green-700 text-white p-3 sm:px-4 sm:py-3 shadow-2xl transition-all hover:scale-105 active:scale-95 group border-2 border-white/20"
    >
      <MessageCircle className="h-6 w-6 sm:h-5 sm:w-5 fill-current animate-bounce group-hover:animate-none" />
      <span className="hidden sm:inline font-bold text-xs sm:text-sm tracking-wide">
        Order on WhatsApp
      </span>
    </a>
  )
}
