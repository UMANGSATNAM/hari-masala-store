const ImageKit = require('imagekit');
require('dotenv').config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

imagekit.listFiles({
    searchQuery: 'name="046347a2-84ec-423a-9338-86c46961a765_PrTwBouS3.png"'
}).then(files => {
    console.log(JSON.stringify(files, null, 2));
}).catch(console.error);
