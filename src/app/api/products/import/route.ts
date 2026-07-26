import { NextRequest, NextResponse } from 'next/server'
import { db as prisma } from '@/lib/db'
import * as xlsx from 'xlsx'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const workbook = xlsx.read(buffer, { type: 'buffer' })
    if (!workbook.SheetNames.length) {
      return NextResponse.json({ error: 'Invalid Excel file' }, { status: 400 })
    }

    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = xlsx.utils.sheet_to_json(firstSheet) as any[]

    let importedCount = 0
    let updatedCount = 0

    for (const row of rows) {
      const name = String(row.Name || '').trim()
      const slug = String(row.Slug || '').trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      
      if (!name) continue // Skip empty rows

      const price = parseFloat(row.Price) || 0
      const mrp = parseFloat(row.MRP) || price
      const weight = String(row.Weight || '100g').trim()
      const description = String(row.Description || name).trim()
      const gujaratiName = row.GujaratiName ? String(row.GujaratiName).trim() : null
      const stock = parseInt(row.Stock) || 50
      const featured = String(row.Featured || '').toLowerCase() === 'yes'
      const active = String(row.Active || 'yes').toLowerCase() !== 'no'
      const rating = parseFloat(row.Rating) || 4.5

      // Parse Categories
      const categoryNames = String(row.Categories || '').split(',').map(c => c.trim()).filter(Boolean)
      const categoryIds = []

      for (const catName of categoryNames) {
        const catSlug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        let category = await prisma.category.findUnique({ where: { name: catName } })
        if (!category) {
          category = await prisma.category.create({
            data: { name: catName, slug: catSlug }
          })
        }
        categoryIds.push(category.id)
      }

      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { slug }
      })

      if (existingProduct) {
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            name,
            gujaratiName,
            description,
            price,
            mrp,
            weight,
            stock,
            featured,
            active,
            rating,
            categories: {
              set: categoryIds.map(id => ({ id }))
            }
          }
        })
        updatedCount++
      } else {
        await prisma.product.create({
          data: {
            name,
            slug,
            gujaratiName,
            description,
            price,
            mrp,
            weight,
            stock,
            featured,
            active,
            rating,
            image: '/placeholder.jpg', // Temporary image
            categories: {
              connect: categoryIds.map(id => ({ id }))
            }
          }
        })
        importedCount++
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Imported ${importedCount} new products, updated ${updatedCount} existing products.` 
    })
  } catch (error) {
    console.error('Import Error:', error)
    return NextResponse.json({ error: 'Failed to import Excel' }, { status: 500 })
  }
}
