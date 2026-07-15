'use client'

import Link from 'next/link'
import { Flame, MessageCircle, Phone, MapPin, Mail, Lock } from 'lucide-react'
import type { Settings } from '@/lib/types'

export function StoreFooter({
  settings,
  onAdminClick,
}: {
  settings: Settings
  onAdminClick: () => void
}) {
  const phoneDisplay = `+${settings.whatsappNumber.slice(0, 2)} ${settings.whatsappNumber.slice(2, 7)} ${settings.whatsappNumber.slice(7)}`

  return (
    <footer id="contact" className="bg-primary-gradient text-primary-foreground mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="grid place-items-center h-9 w-9 rounded-full bg-primary-gradient text-primary-foreground">
                <Flame className="h-5 w-5" />
              </span>
              <span className="font-extrabold text-lg">
                Hari<span className="text-saffron"> Masala</span>
              </span>
            </div>
            <p className="text-sm text-background/70 max-w-xs">
              {settings.storeTagline}. Bringing farm-fresh, authentic Indian
              spices straight to your kitchen.
            </p>
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 px-4 py-2 text-sm font-semibold transition-colors"
            >
              <MessageCircle className="h-4 w-4" /> Order on WhatsApp
            </a>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link href="/" className="hover:text-saffron">Home</Link></li>
              <li><Link href="/#shop" className="hover:text-saffron">Shop Spices</Link></li>
              <li><Link href="/#categories" className="hover:text-saffron">Categories</Link></li>
              <li><Link href="/about" className="hover:text-saffron">About Us</Link></li>
              <li><Link href="/#features" className="hover:text-saffron">Why Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-3">Shop By Category</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link href="/#shop" className="hover:text-saffron">Powder Spices</Link></li>
              <li><Link href="/#shop" className="hover:text-saffron">Whole Spices</Link></li>
              <li><Link href="/#shop" className="hover:text-saffron">Blended Masalas</Link></li>
              <li><Link href="/#shop" className="hover:text-saffron">Premium Spices</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3">Get In Touch</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-saffron" />
                <a href={`https://wa.me/${settings.whatsappNumber}`} className="hover:text-saffron">
                  {phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-saffron" />
                <span>India · Shipping nationwide</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 shrink-0 text-saffron" />
                <span>Order via WhatsApp anytime</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-background/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background/60">
          <p>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Cash on Delivery · WhatsApp Orders</span>
            <button
              onClick={onAdminClick}
              className="inline-flex items-center gap-1 hover:text-saffron transition-colors"
              title="Admin Panel"
            >
              <Lock className="h-3 w-3" /> Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
