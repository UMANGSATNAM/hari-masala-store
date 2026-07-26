const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')
const https = require('https')
const crypto = require('crypto')

const prisma = new PrismaClient()

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to get '${url}' (${res.statusCode})`))
      }
      const file = fs.createWriteStream(dest)
      res.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', (err) => {
      fs.unlink(dest, () => {})
      reject(err)
    })
  })
}

async function main() {
  const products = await prisma.product.findMany()
  const uploadDir = path.join(__dirname, 'public', 'uploads')
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  for (const product of products) {
    if (product.image && product.image.startsWith('https://sfile.chatglm.cn')) {
      const ext = path.extname(new URL(product.image).pathname) || '.jpg'
      const filename = crypto.randomUUID() + ext
      const dest = path.join(uploadDir, filename)
      
      console.log(`Downloading ${product.image} to ${filename}...`)
      try {
        await downloadImage(product.image, dest)
        const localUrl = `/uploads/${filename}`
        await prisma.product.update({
          where: { id: product.id },
          data: { image: localUrl }
        })
        console.log(`Updated product ${product.name}`)
      } catch (e) {
        console.error(`Failed for ${product.name}:`, e.message)
      }
    }
  }
}

main().then(() => {
  console.log('Done')
  prisma.$disconnect()
}).catch(e => {
  console.error(e)
  prisma.$disconnect()
})
