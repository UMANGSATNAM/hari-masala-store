import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { pin } = await req.json()
    if (!pin) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }
    const settings = await db.settings.findUnique({ where: { id: 'default' } })
    const correctPin = settings?.adminPin || '1234'
    if (String(pin) === String(correctPin)) {
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ ok: false }, { status: 401 })
  } catch (e) {
    console.error('Admin verify error:', e)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
