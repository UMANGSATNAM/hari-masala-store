import { db } from '../src/lib/db'

const HERO_IMG = 'https://sfile.chatglm.cn/images-ppt/26bad4ef5b84.jpg'

const categories = [
  { name: 'Powder Spices', slug: 'powder-spices', icon: '🟡', sortOrder: 1 },
  { name: 'Whole Spices', slug: 'whole-spices', icon: '🟤', sortOrder: 2 },
  { name: 'Blended Masalas', slug: 'blended-masalas', icon: '🟠', sortOrder: 3 },
  { name: 'Premium Spices', slug: 'premium-spices', icon: '🔴', sortOrder: 4 },
]

type SeedProduct = {
  name: string
  hindiName: string
  slug: string
  description: string
  price: number
  mrp: number
  weight: string
  categorySlug: string
  image: string
  stock: number
  featured: boolean
  rating: number
}

const products: SeedProduct[] = [
  // ---------- Powder Spices ----------
  {
    name: 'Turmeric Powder',
    hindiName: 'Haldi',
    slug: 'turmeric-powder',
    description: 'Sun-dried and stone-ground turmeric with high curcumin content. Adds golden colour and earthy warmth to every dish. No artificial colour.',
    price: 85, mrp: 110, weight: '200g', categorySlug: 'powder-spices',
    image: 'https://sfile.chatglm.cn/images-ppt/bc4fd2c11f99.jpg',
    stock: 80, featured: true, rating: 4.8,
  },
  {
    name: 'Red Chili Powder',
    hindiName: 'Lal Mirch',
    slug: 'red-chili-powder',
    description: 'Premium Byadgi & Kashmiri red chilies blended for vibrant colour and balanced heat. Smooth texture, no fillers.',
    price: 95, mrp: 120, weight: '200g', categorySlug: 'powder-spices',
    image: 'https://sfile.chatglm.cn/images-ppt/a4b99e765f07.jpg',
    stock: 75, featured: true, rating: 4.7,
  },
  {
    name: 'Coriander Powder',
    hindiName: 'Dhania',
    slug: 'coriander-powder',
    description: 'Freshly ground coriander seeds with a citrusy aroma. The base of every Indian curry. Pure and fragrant.',
    price: 70, mrp: 90, weight: '200g', categorySlug: 'powder-spices',
    image: 'https://sfile.chatglm.cn/images-ppt/648a35f60c7c.png',
    stock: 70, featured: false, rating: 4.6,
  },
  {
    name: 'Garam Masala',
    hindiName: 'Garam Masala',
    slug: 'garam-masala',
    description: 'A classic blend of cardamom, clove, cinnamon, cumin and black pepper. Roasted and ground in small batches for authentic aroma.',
    price: 120, mrp: 150, weight: '100g', categorySlug: 'powder-spices',
    image: 'https://sfile.chatglm.cn/images-ppt/adf352665689.jpg',
    stock: 60, featured: true, rating: 4.9,
  },
  // ---------- Whole Spices ----------
  {
    name: 'Cumin Seeds',
    hindiName: 'Jeera',
    slug: 'cumin-seeds',
    description: 'Whole cumin seeds with strong, warm aroma. Perfect for tempering (tadka) and roasting. Cleaned and sorted.',
    price: 140, mrp: 170, weight: '200g', categorySlug: 'whole-spices',
    image: 'https://sfile.chatglm.cn/images-ppt/15e9dd219788.jpg',
    stock: 65, featured: true, rating: 4.7,
  },
  {
    name: 'Green Cardamom',
    hindiName: 'Elaichi',
    slug: 'green-cardamom',
    description: 'Hand-picked bold green cardamom pods with intense sweet aroma. Ideal for chai, biryani and desserts.',
    price: 180, mrp: 220, weight: '50g', categorySlug: 'whole-spices',
    image: 'https://sfile.chatglm.cn/images-ppt/6cd53fbd316a.jpg',
    stock: 40, featured: true, rating: 4.8,
  },
  {
    name: 'Black Pepper',
    hindiName: 'Kali Mirch',
    slug: 'black-pepper',
    description: 'Whole black peppercorns, sun-dried for sharp pungency and citrus notes. Freshly cracked for best flavour.',
    price: 160, mrp: 200, weight: '100g', categorySlug: 'whole-spices',
    image: 'https://sfile.chatglm.cn/images-ppt/3e4b14085077.jpg',
    stock: 55, featured: false, rating: 4.6,
  },
  {
    name: 'Cloves',
    hindiName: 'Laung',
    slug: 'cloves',
    description: 'Whole cloves with warm, sweet-spicy aroma. Essential for garam masala, biryani and herbal teas.',
    price: 130, mrp: 160, weight: '50g', categorySlug: 'whole-spices',
    image: 'https://sfile.chatglm.cn/images-ppt/c501644cd5c5.png',
    stock: 50, featured: false, rating: 4.5,
  },
  // ---------- Blended Masalas ----------
  {
    name: 'Biryani Masala',
    hindiName: 'Biryani Masala',
    slug: 'biryani-masala',
    description: 'A royal blend of over 15 spices crafted for fragrant dum biryani. Adds depth, aroma and authentic restaurant-style flavour.',
    price: 110, mrp: 140, weight: '100g', categorySlug: 'blended-masalas',
    image: 'https://sfile.chatglm.cn/images-ppt/f0378d392a2c.jpg',
    stock: 60, featured: true, rating: 4.8,
  },
  {
    name: 'Chicken Curry Masala',
    hindiName: 'Chicken Curry Masala',
    slug: 'chicken-curry-masala',
    description: 'Specially blended for rich, homestyle chicken curry. Balanced heat with coriander, cumin and warm spices.',
    price: 105, mrp: 135, weight: '100g', categorySlug: 'blended-masalas',
    image: 'https://sfile.chatglm.cn/images-ppt/192dee4bdcd1.webp',
    stock: 55, featured: false, rating: 4.6,
  },
  {
    name: 'Pav Bhaji Masala',
    hindiName: 'Pav Bhaji Masala',
    slug: 'pav-bhaji-masala',
    description: 'Street-style pav bhaji masala with the perfect tangy-spicy balance. Also great on roasted vegetables and snacks.',
    price: 80, mrp: 100, weight: '100g', categorySlug: 'blended-masalas',
    image: 'https://sfile.chatglm.cn/images-ppt/844dc1100aab.jpg',
    stock: 60, featured: false, rating: 4.5,
  },
  {
    name: 'Chaat Masala',
    hindiName: 'Chaat Masala',
    slug: 'chaat-masala',
    description: 'Tangy, salty and slightly spicy chaat masala with black salt and dried mango. The magic sprinkle for fruits, salads and snacks.',
    price: 75, mrp: 95, weight: '100g', categorySlug: 'blended-masalas',
    image: 'https://sfile.chatglm.cn/images-ppt/a252ea064ed6.jpg',
    stock: 65, featured: true, rating: 4.7,
  },
  // ---------- Premium Spices ----------
  {
    name: 'Saffron',
    hindiName: 'Kesar',
    slug: 'saffron',
    description: 'Premium grade Mongra saffron threads with deep red colour and intense aroma. A little goes a long way for kheer, biryani and sweets.',
    price: 250, mrp: 320, weight: '1g', categorySlug: 'premium-spices',
    image: 'https://sfile.chatglm.cn/images-ppt/1a69198d52f1.jpg',
    stock: 25, featured: true, rating: 4.9,
  },
  {
    name: 'Cinnamon Sticks',
    hindiName: 'Dalchini',
    slug: 'cinnamon-sticks',
    description: 'Whole cinnamon sticks with sweet woody aroma. Perfect for curries, pulao, desserts and warm winter drinks.',
    price: 90, mrp: 120, weight: '100g', categorySlug: 'premium-spices',
    image: 'https://sfile.chatglm.cn/images-ppt/4175868067e6.webp',
    stock: 50, featured: false, rating: 4.6,
  },
  {
    name: 'Star Anise',
    hindiName: 'Chakri Phool',
    slug: 'star-anise',
    description: 'Whole star anise with sweet liquorice aroma. A key spice in biryani and Chinese-style dishes. Beautiful whole pods.',
    price: 120, mrp: 150, weight: '50g', categorySlug: 'premium-spices',
    image: 'https://sfile.chatglm.cn/images-ppt/88699c3b8a04.jpg',
    stock: 40, featured: false, rating: 4.5,
  },
  {
    name: 'Nutmeg',
    hindiName: 'Jaiphal',
    slug: 'nutmeg',
    description: 'Whole nutmeg with warm, sweet and slightly nutty flavour. Grate fresh into desserts, béchamel and spice blends.',
    price: 110, mrp: 140, weight: '50g', categorySlug: 'premium-spices',
    image: 'https://sfile.chatglm.cn/images-ppt/dd931e1db990.jpg',
    stock: 45, featured: false, rating: 4.5,
  },
]

async function main() {
  console.log('Seeding database...')

  // Settings
  await db.settings.upsert({
    where: { id: 'default' },
    update: {
      storeName: 'Hari Masala',
      storeTagline: 'Pure & Authentic Indian Spices',
      whatsappNumber: '919879873113',
      freeShipThreshold: 499,
      adminPin: '1234',
      heroImage: HERO_IMG,
      announcement: 'Free delivery on orders above ₹499 • Cash on delivery available',
    },
    create: {
      id: 'default',
      storeName: 'Hari Masala',
      storeTagline: 'Pure & Authentic Indian Spices',
      whatsappNumber: '919879873113',
      freeShipThreshold: 499,
      adminPin: '1234',
      heroImage: HERO_IMG,
      announcement: 'Free delivery on orders above ₹499 • Cash on delivery available',
    },
  })

  // Categories
  const catMap: Record<string, string> = {}
  for (const c of categories) {
    const cat = await db.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, icon: c.icon, sortOrder: c.sortOrder },
      create: c,
    })
    catMap[c.slug] = cat.id
  }

  // Products
  for (const p of products) {
    await db.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        hindiName: p.hindiName,
        description: p.description,
        price: p.price,
        mrp: p.mrp,
        weight: p.weight,
        categoryId: catMap[p.categorySlug],
        image: p.image,
        stock: p.stock,
        featured: p.featured,
        rating: p.rating,
        active: true,
      },
      create: {
        name: p.name,
        hindiName: p.hindiName,
        slug: p.slug,
        description: p.description,
        price: p.price,
        mrp: p.mrp,
        weight: p.weight,
        categoryId: catMap[p.categorySlug],
        image: p.image,
        stock: p.stock,
        featured: p.featured,
        rating: p.rating,
        active: true,
      },
    })
  }

  console.log(`Seeded ${categories.length} categories and ${products.length} products.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
