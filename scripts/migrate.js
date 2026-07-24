const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting migration...')
  
  const products = await prisma.product.findMany()
  console.log(`Found ${products.length} products to migrate.`)
  
  for (const product of products) {
    if (product.categoryId) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          categories: {
            connect: { id: product.categoryId }
          }
        }
      })
      console.log(`Migrated product: ${product.name}`)
    }
  }
  
  console.log('Migration complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
