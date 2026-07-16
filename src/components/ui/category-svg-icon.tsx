'use client'

import React from 'react'
import {
  Flame, Sparkles, UtensilsCrossed, Sprout, Leaf, Apple, Soup,
  HeartPulse, Package, Star, ShieldCheck, Store, ShoppingBag,
  Tag, Gift, Coffee, Wheat, Droplet, Nut, HeartHandshake, Zap,
} from 'lucide-react'

export const COMMON_SVG_ICONS = [
  { id: 'chilli', label: 'Chilli / Spice', icon: Flame },
  { id: 'masala', label: 'Masala & Powders', icon: Sparkles },
  { id: 'mukhvas', label: 'Mukhvas Bowl', icon: UtensilsCrossed },
  { id: 'whole-spices', label: 'Whole Spices', icon: Sprout },
  { id: 'seeds', label: 'Seeds & Dry Fruits', icon: Leaf },
  { id: 'fruits', label: 'Fruit Bars', icon: Apple },
  { id: 'farali', label: 'Farali Bowl', icon: Soup },
  { id: 'ayurvedic', label: 'Ayurvedic Herb', icon: HeartPulse },
  { id: 'jar', label: 'Spice Jar / Hing', icon: Package },
  { id: 'star', label: 'Premium Star', icon: Star },
  { id: 'shield', label: 'Verified Quality', icon: ShieldCheck },
  { id: 'store', label: 'Catalog / Bag', icon: Store },
]

export function CategorySvgIcon({
  category,
  className = 'h-4 w-4',
}: {
  category?: { slug?: string; icon?: string | null; name?: string } | null
  className?: string
}) {
  const iconKey = (category?.icon || '').toLowerCase().trim()
  const slugKey = (category?.slug || '').toLowerCase().trim()
  const nameKey = (category?.name || '').toLowerCase().trim()

  // Match by explicit icon string, slug, or name
  if (iconKey === 'all' || slugKey === 'all') {
    return <ShoppingBag className={className} />
  }
  if (iconKey === 'chilli' || iconKey === '🌶️' || slugKey.includes('chilli') || nameKey.includes('chilli') || nameKey.includes('મરચું')) {
    return <Flame className={className} />
  }
  if (iconKey === 'masala' || iconKey === 'masala-powders' || iconKey === '🟡' || slugKey.includes('masala') || nameKey.includes('masala') || nameKey.includes('powder')) {
    return <Sparkles className={className} />
  }
  if (iconKey === 'mukhvas' || iconKey === '🍬' || slugKey.includes('mukhvas') || nameKey.includes('mukhvas') || nameKey.includes('મુખવાસ')) {
    return <UtensilsCrossed className={className} />
  }
  if (iconKey === 'whole-spices' || iconKey === 'whole' || iconKey === '🫘' || slugKey.includes('whole') || nameKey.includes('whole') || nameKey.includes('jeera') || nameKey.includes('જીરું')) {
    return <Sprout className={className} />
  }
  if (iconKey === 'seeds' || iconKey === 'seeds-dry-fruits' || iconKey === '🥜' || slugKey.includes('seeds') || slugKey.includes('dry-fruit') || nameKey.includes('seeds') || nameKey.includes('dry fruit')) {
    return <Leaf className={className} />
  }
  if (iconKey === 'fruits' || iconKey === 'fruit-bars' || iconKey === '🍓' || slugKey.includes('fruit-bar') || nameKey.includes('fruit bar') || nameKey.includes('બાર')) {
    return <Apple className={className} />
  }
  if (iconKey === 'farali' || iconKey === 'farali-instant' || iconKey === '🍚' || slugKey.includes('farali') || nameKey.includes('farali') || nameKey.includes('instant') || nameKey.includes('moraiyo')) {
    return <Soup className={className} />
  }
  if (iconKey === 'ayurvedic' || iconKey === '🌿' || slugKey.includes('ayurvedic') || nameKey.includes('ayurvedic') || nameKey.includes('isabgol')) {
    return <HeartPulse className={className} />
  }
  if (iconKey === 'hing' || iconKey === 'jar' || iconKey === '🟤' || slugKey.includes('hing') || nameKey.includes('hing') || nameKey.includes('હિંગ')) {
    return <Package className={className} />
  }
  if (iconKey === 'star' || iconKey === '⭐') {
    return <Star className={className} />
  }
  if (iconKey === 'shield' || iconKey === '🛡️') {
    return <ShieldCheck className={className} />
  }
  if (iconKey === 'store' || iconKey === '🛍️') {
    return <Store className={className} />
  }

  // Fallback icon
  return <Tag className={className} />
}
