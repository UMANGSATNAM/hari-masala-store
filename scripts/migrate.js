const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting migration...')
  
  // 1. Create the _ProductCategories table manually since we can't run prisma db push easily on Hostinger
  console.log('Creating _ProductCategories table if it does not exist...')
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`_ProductCategories\` (
          \`A\` VARCHAR(191) NOT NULL,
          \`B\` VARCHAR(191) NOT NULL,
          UNIQUE INDEX \`_ProductCategories_AB_unique\`(\`A\`, \`B\`),
          INDEX \`_ProductCategories_B_index\`(\`B\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `)
    
    // Add foreign keys (ignore errors if they already exist)
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE \`_ProductCategories\` ADD CONSTRAINT \`_ProductCategories_A_fkey\` FOREIGN KEY (\`A\`) REFERENCES \`Category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;`)
    } catch(e) { console.log('FK A might exist', e.message) }
    
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE \`_ProductCategories\` ADD CONSTRAINT \`_ProductCategories_B_fkey\` FOREIGN KEY (\`B\`) REFERENCES \`Product\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;`)
    } catch(e) { console.log('FK B might exist', e.message) }
    
    console.log('Table setup complete.')
  } catch (err) {
    console.error('Error creating table:', err.message)
  }

  // 2. Migrate data
  const products = await prisma.product.findMany()
  console.log(`Found ${products.length} products to migrate.`)
  
  for (const product of products) {
    if (product.categoryId) {
      try {
        // We use executeRawUnsafe here because the prisma client might not have full types for _ProductCategories if generated incorrectly
        // But since we created the table, we can just insert directly
        await prisma.$executeRawUnsafe(`
          INSERT IGNORE INTO \`_ProductCategories\` (\`A\`, \`B\`) 
          VALUES (?, ?)
        `, product.categoryId, product.id)
        
        console.log(`Migrated product ${product.name}`)
      } catch (e) {
        console.error(`Failed to migrate product ${product.id}:`, e)
      }
    }
  }
  
  console.log('Migration completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
