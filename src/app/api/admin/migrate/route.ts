import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Use a global prisma client to prevent connection issues during dev
const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')
  
  if (key !== 'harimasala123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    let logs = []
    logs.push('Starting database setup and data migration...')
    
    // 1. Create the _ProductCategories table
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS \`_ProductCategories\` (
            \`A\` VARCHAR(191) NOT NULL,
            \`B\` VARCHAR(191) NOT NULL,
            UNIQUE INDEX \`_ProductCategories_AB_unique\`(\`A\`, \`B\`),
            INDEX \`_ProductCategories_B_index\`(\`B\`)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
      `)
      
      try { await prisma.$executeRawUnsafe(`ALTER TABLE \`_ProductCategories\` ADD CONSTRAINT \`_ProductCategories_A_fkey\` FOREIGN KEY (\`A\`) REFERENCES \`Category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;`) } catch(e) {}
      try { await prisma.$executeRawUnsafe(`ALTER TABLE \`_ProductCategories\` ADD CONSTRAINT \`_ProductCategories_B_fkey\` FOREIGN KEY (\`B\`) REFERENCES \`Product\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;`) } catch(e) {}
      
      logs.push('Table setup complete.')
    } catch (err: any) {
      logs.push(`Error creating table: ${err.message}`)
    }

    // 2. Migrate data
    const products = await prisma.product.findMany()
    logs.push(`Found ${products.length} products to migrate.`)
    
    let migratedCount = 0
    for (const product of products) {
      if (product.categoryId) {
        try {
          await prisma.$executeRawUnsafe(`
            INSERT IGNORE INTO \`_ProductCategories\` (\`A\`, \`B\`) 
            VALUES (?, ?)
          `, product.categoryId, product.id)
          migratedCount++
        } catch (e: any) {
          logs.push(`Failed to migrate product ${product.id}: ${e.message}`)
        }
      }
    }
    
    logs.push(`Successfully migrated ${migratedCount} products.`)

    return NextResponse.json({ 
      success: true, 
      message: 'Database synced and data migrated successfully!',
      logs
    })
  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message
    }, { status: 500 })
  }
}
