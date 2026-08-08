import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { slugify } from '@/lib/format'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || ""
});

// Handle image upload when Content-Type is multipart/form-data
async function handleUpload(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg', 'video/mp4', 'video/webm']
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, WEBP, GIF, MP4, WEBM allowed' }, { status: 400 })
    }
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 25MB)' }, { status: 400 })
    }
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${randomUUID()}.${ext}`
    const bytes = await file.arrayBuffer()
    
    // Upload to ImageKit directly instead of local filesystem
    const uploadResult = await new Promise((resolve, reject) => {
      imagekit.upload({
        file: Buffer.from(bytes),
        fileName: filename,
      }, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });

    return NextResponse.json({ url: (uploadResult as any).url, filename })
  } catch (e) {
    console.error('Upload error:', e)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') // slug
  const search = searchParams.get('search')
  const featured = searchParams.get('featured')

  const where: Record<string, unknown> = { active: true }
  if (category && category !== 'all') {
    where.OR = [
      { categories: { some: { slug: category } } },
      { category: { slug: category } }
    ]
  }
  if (featured === 'true') {
    where.featured = true
  }
  if (search) {
    if (where.OR) {
      where.AND = [
        { OR: where.OR },
        { OR: [
          { name: { contains: search } },
          { gujaratiName: { contains: search } },
          { description: { contains: search } },
        ] }
      ]
      delete where.OR
    } else {
      where.OR = [
        { name: { contains: search } },
        { gujaratiName: { contains: search } },
        { description: { contains: search } },
      ]
    }
  }

  try {
    const products = await db.product.findMany({
      where,
      include: { categories: true, category: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json({ products })
  } catch (e: any) {
    console.error('GET /api/products error:', e)
    return NextResponse.json({ products: [], error: e?.message || String(e) })
  }
}

export async function POST(req: NextRequest) {
  // Detect image upload (multipart/form-data) vs product create (application/json)
  const contentType = req.headers.get('content-type') || ''
  if (contentType.includes('multipart/form-data')) {
    return handleUpload(req)
  }
  try {
    const body = await req.json()
    const {
      name, gujaratiName, description, price, mrp, weight, variants,
      categoryIds, image, images, stock, featured, active, rating,
    } = body

    if (!name || !description || price == null || !categoryIds || categoryIds.length === 0 || !image) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const slug = slugify(name) + '-' + Date.now().toString(36)
    const product = await db.product.create({
      data: {
        name,
        gujaratiName: gujaratiName || null,
        slug,
        description,
        price: Number(price),
        mrp: Number(mrp) || Number(price),
        weight: weight || '100g',
        variants: variants ? variants : undefined,
        categories: { connect: categoryIds.map((id: string) => ({ id })) },
        categoryId: categoryIds[0], // Maintain temporarily for migration
        image,
        images: images ? images : undefined,
        stock: Number(stock) ?? 50,
        featured: Boolean(featured),
        active: active !== false,
        rating: Number(rating) || 4.5,
      },
      include: { categories: true },
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (e) {
    console.error('Create product error:', e)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
