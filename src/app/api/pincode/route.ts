import { NextRequest, NextResponse } from 'next/server'
import { normalizeStateName, getStateFromPincodePrefix } from '@/lib/pincode'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = (searchParams.get('code') || searchParams.get('pincode') || '').replace(/\D/g, '').trim()

  if (!code || code.length !== 6) {
    return NextResponse.json(
      { success: false, error: 'Valid 6-digit PIN code is required' },
      { status: 400 }
    )
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3500)

    const response = await fetch(`https://api.postalpincode.in/pincode/${code}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    })
    clearTimeout(timeoutId)

    if (response.ok) {
      const data = await response.json()
      if (Array.isArray(data) && data[0]?.Status === 'Success' && Array.isArray(data[0]?.PostOffice) && data[0].PostOffice.length > 0) {
        const po = data[0].PostOffice[0]
        const rawState = po.State || po.Circle || ''
        const district = po.District || po.Division || po.Block || po.Name || ''
        const normalizedState = normalizeStateName(rawState) || getStateFromPincodePrefix(code)

        if (normalizedState) {
          return NextResponse.json({
            success: true,
            pincode: code,
            state: normalizedState,
            city: district,
            district,
            source: 'api',
          })
        }
      }
    }
  } catch (e) {
    console.warn('Postal pincode API failed or timed out:', e)
  }

  // Fallback to prefix mapping
  const fallbackState = getStateFromPincodePrefix(code)
  if (fallbackState) {
    return NextResponse.json({
      success: true,
      pincode: code,
      state: fallbackState,
      source: 'fallback',
    })
  }

  return NextResponse.json(
    { success: false, error: 'Pincode not found or invalid' },
    { status: 404 }
  )
}
