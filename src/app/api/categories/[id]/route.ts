import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const data: Record<string, unknown> = {}
    if (body.name !== undefined) data.name = body.name
    if (body.icon !== undefined) data.icon = body.icon
    if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder)
    const category = await db.category.update({ where: { id }, data })
    return NextResponse.json({ category })
  } catch (e) {
    console.error('Update category error:', e)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.category.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Delete category error:', e)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
