import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function GET() {
  try {
    const settings = await db.settings.findUnique({ where: { id: 'default' } })
    if (!settings) {
      return NextResponse.json({
        settings: {
          id: 'default',
          storeName: 'Hari Masala',
          storeTagline: 'Pure & Authentic Indian Spices',
          whatsappNumber: '919879873113',
          freeShipThreshold: 499,
          adminPin: '',
          heroImage: null,
          announcement: null,
        },
      })
    }
    // Never expose the admin pin to the client
    return NextResponse.json({ settings: { ...settings, adminPin: '' } })
  } catch (e) {
    console.error('GET /api/settings database error:', e)
    return NextResponse.json({
      settings: {
        id: 'default',
        storeName: 'Hari Masala',
        storeTagline: 'Pure & Authentic Indian Spices',
        whatsappNumber: '919879873113',
        freeShipThreshold: 499,
        adminPin: '',
        heroImage: null,
        announcement: null,
      },
    })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const data: Record<string, unknown> = {}
    const fields = ['storeName', 'storeTagline', 'whatsappNumber', 'announcement', 'heroImage']
    for (const f of fields) {
      if (body[f] !== undefined) data[f] = body[f]
    }
    if (body.freeShipThreshold !== undefined) {
      data.freeShipThreshold = Number(body.freeShipThreshold)
    }
    if (body.adminPin !== undefined && body.adminPin !== '') {
      data.adminPin = body.adminPin
    }

    const settings = await db.settings.upsert({
      where: { id: 'default' },
      update: data,
      create: {
        id: 'default',
        storeName: body.storeName || 'Hari Masala',
        storeTagline: body.storeTagline || 'Pure & Authentic Indian Spices',
        whatsappNumber: body.whatsappNumber || '919879873113',
        freeShipThreshold: Number(body.freeShipThreshold) || 499,
        announcement: body.announcement || null,
        heroImage: body.heroImage || null,
        ...(body.adminPin ? { adminPin: body.adminPin } : {}),
      },
    })

    return NextResponse.json({ settings: { ...settings, adminPin: '' } })
  } catch (e) {
    console.error('Update settings error:', e)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
