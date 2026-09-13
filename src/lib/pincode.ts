export const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const

export type IndianState = (typeof INDIAN_STATES)[number]

export function normalizeStateName(raw: string): IndianState | null {
  if (!raw) return null
  const clean = raw.trim().toLowerCase()

  // Exact or direct match
  const found = INDIAN_STATES.find((s) => s.toLowerCase() === clean)
  if (found) return found

  // Aliases and partial variations
  if (clean.includes('delhi')) return 'Delhi'
  if (clean.includes('gujarat')) return 'Gujarat'
  if (clean.includes('maharashtra')) return 'Maharashtra'
  if (clean.includes('rajasthan')) return 'Rajasthan'
  if (clean.includes('madhya pradesh') || clean === 'mp') return 'Madhya Pradesh'
  if (clean.includes('uttar pradesh') || clean === 'up') return 'Uttar Pradesh'
  if (clean.includes('uttarakhand') || clean.includes('uttaranchal')) return 'Uttarakhand'
  if (clean.includes('orissa') || clean.includes('odisha')) return 'Odisha'
  if (clean.includes('west bengal') || clean === 'wb') return 'West Bengal'
  if (clean.includes('karnataka')) return 'Karnataka'
  if (clean.includes('tamil nadu') || clean.includes('tamilnadu')) return 'Tamil Nadu'
  if (clean.includes('telangana') || clean.includes('telengana')) return 'Telangana'
  if (clean.includes('andhra')) return 'Andhra Pradesh'
  if (clean.includes('kerala')) return 'Kerala'
  if (clean.includes('bihar')) return 'Bihar'
  if (clean.includes('jharkhand')) return 'Jharkhand'
  if (clean.includes('chhattisgarh') || clean.includes('chattisgarh')) return 'Chhattisgarh'
  if (clean.includes('haryana')) return 'Haryana'
  if (clean.includes('punjab')) return 'Punjab'
  if (clean.includes('himachal')) return 'Himachal Pradesh'
  if (clean.includes('jammu') || clean.includes('kashmir')) return 'Jammu and Kashmir'
  if (clean.includes('ladakh')) return 'Ladakh'
  if (clean.includes('goa')) return 'Goa'
  if (clean.includes('assam')) return 'Assam'
  if (clean.includes('chandigarh')) return 'Chandigarh'
  if (clean.includes('pondicherry') || clean.includes('puducherry')) return 'Puducherry'
  if (clean.includes('daman') || clean.includes('diu') || clean.includes('dadra') || clean.includes('nagar haveli'))
    return 'Dadra and Nagar Haveli and Daman and Diu'
  if (clean.includes('sikkim')) return 'Sikkim'
  if (clean.includes('tripura')) return 'Tripura'
  if (clean.includes('manipur')) return 'Manipur'
  if (clean.includes('meghalaya')) return 'Meghalaya'
  if (clean.includes('mizoram')) return 'Mizoram'
  if (clean.includes('nagaland')) return 'Nagaland'
  if (clean.includes('arunachal')) return 'Arunachal Pradesh'
  if (clean.includes('andaman') || clean.includes('nicobar')) return 'Andaman and Nicobar Islands'
  if (clean.includes('lakshadweep')) return 'Lakshadweep'

  return null
}

export function getStateFromPincodePrefix(pincode: string): IndianState | null {
  const pin = pincode.replace(/\D/g, '')
  if (pin.length < 2) return null

  // Special prefix checks (3 digits)
  if (pin.startsWith('403')) return 'Goa'
  if (pin.startsWith('396')) return 'Dadra and Nagar Haveli and Daman and Diu'
  if (pin.startsWith('605')) return 'Puducherry'
  if (pin.startsWith('682')) return 'Lakshadweep'
  if (pin.startsWith('744')) return 'Andaman and Nicobar Islands'
  if (pin.startsWith('737')) return 'Sikkim'
  if (pin.startsWith('194')) return 'Ladakh'
  if (pin.startsWith('790') || pin.startsWith('791') || pin.startsWith('792')) return 'Arunachal Pradesh'
  if (pin.startsWith('793') || pin.startsWith('794')) return 'Meghalaya'
  if (pin.startsWith('795')) return 'Manipur'
  if (pin.startsWith('796')) return 'Mizoram'
  if (pin.startsWith('797') || pin.startsWith('798')) return 'Nagaland'
  if (pin.startsWith('799')) return 'Tripura'

  // 2-digit prefix checks
  const p2 = pin.slice(0, 2)
  const p2Num = parseInt(p2, 10)

  if (p2 === '11') return 'Delhi'
  if (p2 === '12' || p2 === '13') return 'Haryana'
  if (p2 === '14' || p2 === '15') return 'Punjab'
  if (p2 === '16') return 'Chandigarh'
  if (p2 === '17') return 'Himachal Pradesh'
  if (p2 === '18' || p2 === '19') return 'Jammu and Kashmir'
  if (p2Num >= 20 && p2Num <= 28) {
    if (p2 === '24' || p2 === '26') {
      // Could be Uttarakhand or western UP
      return 'Uttarakhand'
    }
    return 'Uttar Pradesh'
  }
  if (p2Num >= 30 && p2Num <= 34) return 'Rajasthan'
  if (p2Num >= 36 && p2Num <= 39) return 'Gujarat'
  if (p2Num >= 40 && p2Num <= 44) return 'Maharashtra'
  if (p2Num >= 45 && p2Num <= 48) return 'Madhya Pradesh'
  if (p2 === '49') return 'Chhattisgarh'
  if (p2 === '50') return 'Telangana'
  if (p2Num >= 51 && p2Num <= 53) return 'Andhra Pradesh'
  if (p2Num >= 56 && p2Num <= 59) return 'Karnataka'
  if (p2Num >= 60 && p2Num <= 64) return 'Tamil Nadu'
  if (p2Num >= 67 && p2Num <= 69) return 'Kerala'
  if (p2Num >= 70 && p2Num <= 74) return 'West Bengal'
  if (p2Num >= 75 && p2Num <= 77) return 'Odisha'
  if (p2 === '78' || p2 === '79') return 'Assam'
  if (p2 === '83') return 'Jharkhand'
  if (p2Num >= 80 && p2Num <= 85) return 'Bihar'

  return null
}

export type PincodeLookupResult = {
  success: boolean
  pincode: string
  state?: IndianState
  city?: string
  district?: string
  source?: 'api' | 'fallback'
  error?: string
}

export async function lookupPincode(pincode: string): Promise<PincodeLookupResult> {
  const clean = pincode.replace(/\D/g, '').trim()
  if (clean.length !== 6) {
    return { success: false, pincode: clean, error: 'Pincode must be 6 digits' }
  }

  try {
    const res = await fetch(`/api/pincode?code=${encodeURIComponent(clean)}`)
    if (res.ok) {
      const data = await res.json()
      if (data.success && data.state) {
        return data as PincodeLookupResult
      }
    }
  } catch (err) {
    console.warn('Direct api/pincode fetch failed, trying fallback:', err)
  }

  // Fallback if network or API route failed
  const fallbackState = getStateFromPincodePrefix(clean)
  if (fallbackState) {
    return {
      success: true,
      pincode: clean,
      state: fallbackState,
      source: 'fallback',
    }
  }

  return {
    success: false,
    pincode: clean,
    error: 'Could not detect state for this pincode',
  }
}
