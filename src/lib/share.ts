import { toast } from 'sonner'
import type { Product } from './types'

export async function shareProductWithImage(options: {
  product: Product | { name: string; gujaratiName?: string | null; image?: string | null; slug: string }
  selectedVariant?: { weight: string; price: number; mrp?: number }
  shareUrl?: string
}) {
  const { product, selectedVariant, shareUrl } = options

  const url =
    shareUrl ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}/product/${product.slug}`
      : `https://harimasala.com/product/${product.slug}`)

  const label = product.gujaratiName ? `${product.gujaratiName} (${product.name})` : product.name
  const variantInfo = selectedVariant ? ` (${selectedVariant.weight} - ₹${selectedVariant.price})` : ''
  const title = `Hari Masala - ${label}`
  const text = `🌶️ *Hari Masala* - Check out ${label}${variantInfo}!\nAuthentic & pure spices delivered to your home.`

  let imageUrl = product.image || '/placeholder.svg'
  if (typeof window !== 'undefined' && imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = `${window.location.origin}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
  }

  // 1. Try Web Share API with attached File if supported by OS/browser
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && navigator.share) {
    let imageFile: File | null = null

    if (imageUrl && !imageUrl.includes('placeholder.svg')) {
      try {
        const response = await fetch(imageUrl, { cache: 'force-cache' })
        if (response.ok) {
          const blob = await response.blob()
          const mimeType = blob.type && blob.type.startsWith('image/') ? blob.type : 'image/jpeg'
          const ext = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg'
          const filename = `${product.slug || 'product'}.${ext}`
          imageFile = new File([blob], filename, { type: mimeType })
        }
      } catch (err) {
        console.warn('Could not fetch image blob for native share:', err)
      }
    }

    if (imageFile && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
      try {
        await navigator.share({
          title,
          text: `${text}\n\n👉 View Product: ${url}`,
          files: [imageFile],
        })
        return { success: true, method: 'files' }
      } catch (err: any) {
        if (err.name === 'AbortError') return { success: false, method: 'cancel' }
        console.warn('Native file share failed, trying text share fallback:', err)
      }
    }

    // Fallback: Native text & URL share
    try {
      await navigator.share({
        title,
        text,
        url,
      })
      return { success: true, method: 'native-text' }
    } catch (err: any) {
      if (err.name === 'AbortError') return { success: false, method: 'cancel' }
    }
  }

  // 2. Direct WhatsApp Web/App Fallback with image link + buy link
  const imageSnippet = imageUrl && !imageUrl.includes('placeholder.svg') ? `\n📷 *Product Image:* ${imageUrl}` : ''
  const whatsappMsg = `${text}${imageSnippet}\n\n👉 *Buy Now:* ${url}`
  window.open(`https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`, '_blank')
  return { success: true, method: 'whatsapp-web' }
}

export async function copyProductLink(url: string) {
  try {
    await navigator.clipboard.writeText(url)
    toast.success('✓ Product link copied to clipboard!')
    return true
  } catch (e) {
    toast.error('Failed to copy product link')
    return false
  }
}
