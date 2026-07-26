import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import * as xlsx from 'xlsx'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') // 'template' or 'all'

    let data: any[] = []

    if (type === 'all') {
      const products = await prisma.product.findMany({
        include: { categories: true }
      })

      data = products.map(p => ({
        Name: p.name,
        GujaratiName: p.gujaratiName || '',
        Slug: p.slug,
        Description: p.description,
        Price: p.price,
        MRP: p.mrp,
        Weight: p.weight,
        Stock: p.stock,
        Featured: p.featured ? 'Yes' : 'No',
        Active: p.active ? 'Yes' : 'No',
        Rating: p.rating,
        Categories: p.categories.map(c => c.name).join(', ')
      }))
    } else {
      // Template
      data = [{
        Name: 'Example Product',
        GujaratiName: 'ઉદાહરણ',
        Slug: 'example-product',
        Description: 'This is an example product',
        Price: 100,
        MRP: 120,
        Weight: '500g',
        Stock: 50,
        Featured: 'No',
        Active: 'Yes',
        Rating: 4.5,
        Categories: 'Whole Spices, Blended Spices'
      }]
    }

    const worksheet = xlsx.utils.json_to_sheet(data)
    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Products')

    // Create a buffer from the workbook
    const buf = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    const filename = type === 'all' ? 'products-export.xlsx' : 'products-template.xlsx'

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    })
  } catch (error) {
    console.error('Export Error:', error)
    return NextResponse.json({ error: 'Failed to export Excel' }, { status: 500 })
  }
}
