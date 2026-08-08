const ImageKit = require("imagekit");
require('dotenv').config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || ""
});

async function main() {
    console.log("Testing ImageKit upload...");
    const dummyBuffer = Buffer.from("Hello World", 'utf-8');
    
    try {
        const uploadResult = await new Promise((resolve, reject) => {
            imagekit.upload({
                file: dummyBuffer,
                fileName: 'test-upload.txt',
            }, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            });
        });
        console.log("Upload success:", uploadResult);
    } catch (e) {
        console.error("Upload failed:", e);
    }
}

main();
