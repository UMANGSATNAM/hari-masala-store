const { PrismaClient } = require('@prisma/client')
const fs = require('fs')

const prisma = new PrismaClient()

async function main() {
  const log = fs.readFileSync('C:/Users/onwer/.gemini/antigravity-ide/brain/097c7238-9aec-46a3-ba47-975084ea3685/.system_generated/tasks/task-66.log', 'utf8')
  const lines = log.split('\n')
  
  let currentUrl = null
  
  for (const line of lines) {
    if (line.startsWith('Downloading ')) {
      currentUrl = line.split(' ')[1]
    } else if (line.startsWith('Updated product ') && currentUrl) {
      const name = line.replace('Updated product ', '').trim()
      await prisma.product.updateMany({
        where: { name },
        data: { image: currentUrl }
      })
      console.log(`Restored ${name} to ${currentUrl}`)
      currentUrl = null
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
