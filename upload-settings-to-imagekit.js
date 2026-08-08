const ImageKit = require("imagekit");
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const imagekit = new ImageKit({
  publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});

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
    console.log("Migrating Settings images to ImageKit...");
    const settings = await prisma.settings.findFirst();
    if (!settings) return console.log("No settings found.");
    
    let updated = false;
    let newLogoImage = settings.logoImage;
    let newHeroImages = [];
    
    // Process logo
    if (settings.logoImage && settings.logoImage.startsWith('/uploads/')) {
        const localPath = path.join(__dirname, 'public', settings.logoImage);
        if (fs.existsSync(localPath)) {
            console.log("Uploading logo...");
            const fileData = fs.readFileSync(localPath);
            newLogoImage = await uploadToImageKit(fileData, 'logo' + path.extname(localPath));
            console.log("Logo uploaded:", newLogoImage);
            updated = true;
        }
    }
    
    // Process hero images
    if (settings.heroImage) {
        try {
            const heroes = JSON.parse(settings.heroImage);
            for (let i = 0; i < heroes.length; i++) {
                if (heroes[i].startsWith('/uploads/')) {
                    const localPath = path.join(__dirname, 'public', heroes[i]);
                    if (fs.existsSync(localPath)) {
                        console.log(`Uploading hero image ${i}...`);
                        const fileData = fs.readFileSync(localPath);
                        const newUrl = await uploadToImageKit(fileData, `hero-${i}` + path.extname(localPath));
                        newHeroImages.push(newUrl);
                        console.log(`Hero ${i} uploaded:`, newUrl);
                        updated = true;
                    } else {
                        newHeroImages.push(heroes[i]);
                    }
                } else {
                    newHeroImages.push(heroes[i]);
                }
            }
        } catch (e) {
            console.error("Error parsing heroImage array");
        }
    }
    
    if (updated) {
        await prisma.settings.update({
            where: { id: settings.id },
            data: {
                logoImage: newLogoImage,
                heroImage: JSON.stringify(newHeroImages)
            }
        });
        console.log("Settings successfully updated in DB!");
    } else {
        console.log("No local uploads found in settings.");
    }
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); });
