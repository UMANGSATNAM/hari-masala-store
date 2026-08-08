const ImageKit = require("imagekit");
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const https = require('https');

const prisma = new PrismaClient();

const imagekit = new ImageKit({
  publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});

function fetchBuffer(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                return reject(new Error(`Failed to fetch ${url} (${res.statusCode})`));
            }
            const data = [];
            res.on('data', chunk => data.push(chunk));
            res.on('end', () => resolve(Buffer.concat(data)));
        }).on('error', reject);
    });
}

async function uploadToImageKit(file, fileName) {
    return new Promise((resolve, reject) => {
        imagekit.upload({
            file: file,
            fileName: fileName,
        }, function(error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result.url);
            }
        });
    });
}

async function main() {
    console.log("Starting ImageKit migration...");
    const products = await prisma.product.findMany();
    
    for (const product of products) {
        if (!product.image || product.image.startsWith('https://ik.imagekit.io')) {
            console.log(`Skipping ${product.name}: No image or already on ImageKit.`);
            continue;
        }

        let fileData;
        let fileName = product.name.replace(/[^a-zA-Z0-9]/g, '-') + '-' + product.id;
        
        try {
            if (product.image.startsWith('/uploads/')) {
                const localPath = path.join(__dirname, 'public', product.image);
                if (fs.existsSync(localPath)) {
                    fileData = fs.readFileSync(localPath);
                    fileName += path.extname(localPath);
                } else {
                    console.log(`Local file missing for ${product.name}: ${localPath}`);
                    continue;
                }
            } else if (product.image.startsWith('http')) {
                console.log(`Downloading external image for ${product.name}...`);
                fileData = await fetchBuffer(product.image);
                fileName += '.jpg';
            }
            
            if (fileData) {
                console.log(`Uploading image for ${product.name} to ImageKit...`);
                const newUrl = await uploadToImageKit(fileData, fileName);
                
                await prisma.product.update({
                    where: { id: product.id },
                    data: { image: newUrl }
                });
                console.log(`Successfully updated ${product.name} with URL: ${newUrl}`);
            }
        } catch(e) {
            console.error(`Failed to process image for ${product.name}: ${e.message}`);
        }
    }
}

main().then(() => {
    console.log('Migration complete');
    prisma.$disconnect();
}).catch(e => {
    console.error(e);
    prisma.$disconnect();
});
