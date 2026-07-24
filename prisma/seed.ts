import { db } from '../src/lib/db'

const HERO_IMG = 'https://sfile.chatglm.cn/images-ppt/26bad4ef5b84.jpg'

// Image library (real photos fetched via web image search)
const IMG = {
  mukhvasMix: 'https://sfile.chatglm.cn/images-ppt/a5f1c327eb23.jpg',
  mukhvasPaan: 'https://sfile.chatglm.cn/images-ppt/16b9c9523ce0.jpg',
  mukhvasGotli: 'https://sfile.chatglm.cn/images-ppt/639f2597834e.jpg',
  mukhvasAmla: 'https://sfile.chatglm.cn/images-ppt/2e9e488d15ac.jpg',
  chaas: 'https://sfile.chatglm.cn/images-ppt/82ed975b9167.jpg',
  amchur: 'https://sfile.chatglm.cn/images-ppt/0e5508247cf3.png',
  haldi: 'https://sfile.chatglm.cn/images-ppt/d5230e0caaed.jpg',
  dhanajiru: 'https://sfile.chatglm.cn/images-ppt/f86c1c9f44e3.jpg',
  teamasala: 'https://sfile.chatglm.cn/images-ppt/62d290d4d7b5.jpg',
  garam: 'https://sfile.chatglm.cn/images-ppt/70b396d4fc88.png',
  chilliRed: 'https://sfile.chatglm.cn/images-ppt/4e088b6d864d.jpg',
  chilliKashmiri: 'https://sfile.chatglm.cn/images-ppt/5afae7802b7c.jpg',
  chilliResham: 'https://sfile.chatglm.cn/images-ppt/06806c9801c7.jpg',
  hingSolid: 'https://sfile.chatglm.cn/images-ppt/a91a0b480977.jpg',
  hingPowder: 'https://sfile.chatglm.cn/images-ppt/89f47521aee9.jpg',
  jeera: 'https://sfile.chatglm.cn/images-ppt/22175c922653.jpg',
  shahjeera: 'https://sfile.chatglm.cn/images-ppt/ee3f3c24b275.jpg',
  dhanadal: 'https://sfile.chatglm.cn/images-ppt/beea3bb3a536.jpg',
  dhana: 'https://sfile.chatglm.cn/images-ppt/4deff9002fd1.jpg',
  rai: 'https://sfile.chatglm.cn/images-ppt/855d2fab7638.jpg',
  methi: 'https://sfile.chatglm.cn/images-ppt/fa0de3927fb8.jpg',
  ajwain: 'https://sfile.chatglm.cn/images-ppt/8fc009c292bb.jpg',
  variya: 'https://sfile.chatglm.cn/images-ppt/05a636388fac.jpg',
  suva: 'https://sfile.chatglm.cn/images-ppt/fe5b2cffe09a.jpg',
  kalonji: 'https://sfile.chatglm.cn/images-ppt/c1b5fc510da1.jpg',
  kokum: 'https://sfile.chatglm.cn/images-ppt/1ac782917bde.jpg',
  kesar: 'https://sfile.chatglm.cn/images-ppt/3b233bf35de1.jpg',
  sunflower: 'https://sfile.chatglm.cn/images-ppt/a58ed92fac9f.jpg',
  chia: 'https://sfile.chatglm.cn/images-ppt/a0278461c861.jpg',
  pumpkin: 'https://sfile.chatglm.cn/images-ppt/373618175d08.jpg',
  mixseeds: 'https://sfile.chatglm.cn/images-ppt/938ea78ba828.jpg',
  basil: 'https://sfile.chatglm.cn/images-ppt/458dddb04453.jpg',
  cranberry: 'https://sfile.chatglm.cn/images-ppt/27a99bfa0ece.jpg',
  strawberry: 'https://sfile.chatglm.cn/images-ppt/b786bd56ca24.jpg',
  blueberry: 'https://sfile.chatglm.cn/images-ppt/0430646f7ec6.png',
  kiwi: 'https://sfile.chatglm.cn/images-ppt/2d64d3a55033.jpg',
  mango: 'https://sfile.chatglm.cn/images-ppt/61a9ff1d541c.png',
  pineapple: 'https://sfile.chatglm.cn/images-ppt/ed660791ff02.webp',
  mixdry: 'https://sfile.chatglm.cn/images-ppt/16993bad24e4.jpg',
  fbBars: 'https://sfile.chatglm.cn/images-ppt/6b1dcc9ab4ab.jpg',
  fbTamarind: 'https://sfile.chatglm.cn/images-ppt/1d386d3446fe.jpg',
  fbMango: 'https://sfile.chatglm.cn/images-ppt/b4d4c3615492.jpg',
  fbOrange: 'https://sfile.chatglm.cn/images-ppt/84db66c4f10f.jpg',
  moraiyo: 'https://sfile.chatglm.cn/images-ppt/f9e06acf251e.jpg',
  sabudana: 'https://sfile.chatglm.cn/images-ppt/b1218092a9bb.jpg',
  rocksalt: 'https://sfile.chatglm.cn/images-ppt/61fc2552ff6c.jpg',
  besan: 'https://sfile.chatglm.cn/images-ppt/a00a08cd4061.jpg',
  panipuri: 'https://sfile.chatglm.cn/images-ppt/18fae5d12f89.jpg',
  isabgol: 'https://sfile.chatglm.cn/images-ppt/7d3a510df137.jpg',
  gond: 'https://sfile.chatglm.cn/images-ppt/dbbdb546c67c.jpg',
  aampanna: 'https://sfile.chatglm.cn/images-ppt/f87456bc89e6.jpg',
}

const categories = [
  { name: 'Mukhvas', slug: 'mukhvas', icon: 'mukhvas', sortOrder: 1 },
  { name: 'Masala & Powders', slug: 'masala-powders', icon: 'masala', sortOrder: 2 },
  { name: 'Chilli', slug: 'chilli', icon: 'chilli', sortOrder: 3 },
  { name: 'Hing', slug: 'hing', icon: 'hing', sortOrder: 4 },
  { name: 'Whole Spices', slug: 'whole-spices', icon: 'whole-spices', sortOrder: 5 },
  { name: 'Seeds & Dry Fruits', slug: 'seeds-dry-fruits', icon: 'seeds', sortOrder: 6 },
  { name: 'Fruit Bars', slug: 'fruit-bars', icon: 'fruits', sortOrder: 7 },
  { name: 'Farali & Instant Mix', slug: 'farali-instant', icon: 'farali', sortOrder: 8 },
  { name: 'Ayurvedic', slug: 'ayurvedic', icon: 'ayurvedic', sortOrder: 9 },
]

type P = {
  g: string; e: string; weight: string; price: number; mrp?: number
  cat: string; img: string; feat?: boolean; rating?: number; stock?: number; desc: string
}

const products: P[] = [
  // ===== Mukhvas (14) =====
  { g: 'ગુજરાતી મિક્સ મુખવાસ', e: 'Gujarati Mix Mukhvas', weight: '500gm', price: 140, cat: 'mukhvas', img: IMG.mukhvasMix, feat: true, rating: 4.8, desc: 'A colourful traditional Gujarati mouth-freshener mix of fennel, sesame, coconut and dry fruits. Perfect after-meal refreshment.' },
  { g: 'કલકત્તી પાન મુખવાસ', e: 'Kalkatti Paan Mukhvas', weight: '500gm', price: 150, cat: 'mukhvas', img: IMG.mukhvasPaan, feat: true, rating: 4.7, desc: 'Paan-flavoured mukhvas with the classic taste of betel leaf, gulkand and fennel. A refreshing after-meal treat.' },
  { g: 'ગોટલી', e: 'Gotli', weight: '500gm', price: 170, cat: 'mukhvas', img: IMG.mukhvasGotli, rating: 4.5, desc: 'Crunchy sweet-and-salty gotli made from selected ingredients. A beloved Gujarati snack and mouth freshener.' },
  { g: 'અળસી - ગોટલી મુખવાસ', e: 'Alsi-Gotli Mukhvas', weight: '500gm', price: 130, cat: 'mukhvas', img: IMG.mukhvasGotli, rating: 4.5, desc: 'Flaxseed (alsi) based gotli mukhvas — rich in omega-3 and full of crunch. Healthy and tasty.' },
  { g: 'તલ - ગોટલી મુખવાસ', e: 'Tal-Gotli Mukhvas', weight: '500gm', price: 140, mrp: 180, cat: 'mukhvas', img: IMG.mukhvasGotli, rating: 4.6, desc: 'Sesame (tal) gotli mukhvas with a nutty flavour and satisfying crunch.' },
  { g: 'એવરી ડે મુખવાસ', e: 'Everyday Mukhvas', weight: '500gm', price: 140, cat: 'mukhvas', img: IMG.mukhvasMix, rating: 4.5, desc: 'A balanced everyday mukhvas mix for daily refreshment after meals.' },
  { g: 'દિલરંજન મુખવાસ', e: 'Dilranjan Mukhvas', weight: '500gm', price: 160, mrp: 200, cat: 'mukhvas', img: IMG.mukhvasMix, rating: 4.6, desc: 'Premium dilranjan mukhvas with a rich blend of dry fruits and aromatic spices.' },
  { g: 'દિલખુશ મુખવાસ', e: 'Dilkhush Mukhvas', weight: '250gm', price: 90, cat: 'mukhvas', img: IMG.mukhvasMix, rating: 4.4, desc: 'Delightful dilkhush mukhvas — a heart-pleasing mix of sweet and savoury flavours.' },
  { g: 'કેસરમિક્સ મુખવાસ', e: 'Kesarmix Mukhvas', weight: '500gm', price: 170, cat: 'mukhvas', img: IMG.mukhvasMix, feat: true, rating: 4.7, desc: 'Saffron-infused premium mukhvas with a royal aroma and rich taste.' },
  { g: 'આમળાં અદરક મુખવાસ', e: 'Amla-Adrak Mukhvas', weight: '250gm', price: 100, cat: 'mukhvas', img: IMG.mukhvasAmla, rating: 4.5, desc: 'Amla and ginger mukhvas — tangy, spicy and great for digestion.' },
  { g: 'બોર - આમળાં મુખવાસ', e: 'Bor-Amla Mukhvas', weight: '150gm', price: 120, cat: 'mukhvas', img: IMG.mukhvasAmla, rating: 4.5, desc: 'Bor (ber) and amla mukhvas with a tangy-sweet taste, rich in Vitamin C.' },
  { g: 'મસાલા આમળા', e: 'Masala Amla', weight: '250gm', price: 100, cat: 'mukhvas', img: IMG.mukhvasAmla, rating: 4.6, desc: 'Spiced masala amla — tangy, salty and packed with digestive goodness.' },
  { g: 'સ્વીટ આમળા', e: 'Sweet Amla', weight: '500gm', price: 120, cat: 'mukhvas', img: IMG.mukhvasAmla, rating: 4.5, desc: 'Sweet candied amla — a healthy treat rich in Vitamin C.' },
  { g: 'શાહી અજવાઇન', e: 'Shahi Ajwain', weight: '200gm', price: 190, mrp: 300, cat: 'mukhvas', img: IMG.mukhvasMix, feat: true, rating: 4.7, desc: 'Royal shahi ajwain mukhvas with carom seeds, dry fruits and aromatic spices.' },

  // ===== Masala & Powders (6) =====
  { g: 'છાશનો મસાલો', e: 'Butter Milk Masala', weight: '250gm', price: 80, cat: 'masala-powders', img: IMG.chaas, feat: true, rating: 4.7, desc: 'Special chaas masala for refreshing spiced buttermilk. Tangy, salty and digestive.' },
  { g: 'આમચૂર પાવડર', e: 'Dry Mango Powder', weight: '100gm', price: 40, cat: 'masala-powders', img: IMG.amchur, rating: 4.5, desc: 'Pure dried mango powder (amchur) for tangy flavour in curries, chaats and snacks.' },
  { g: 'હળદર સેલમ', e: 'Selam Turmeric', weight: '1kg', price: 300, mrp: 400, cat: 'masala-powders', img: IMG.haldi, feat: true, rating: 4.8, desc: 'Premium Selam turmeric powder with high curcumin, deep colour and pure aroma.' },
  { g: 'ધાણાજીરુ પાવડર', e: 'Dhana-Jiru Powder', weight: '1kg', price: 340, cat: 'masala-powders', img: IMG.dhanajiru, rating: 4.7, desc: 'Classic Gujarati dhana-jiru blend of roasted coriander and cumin. The base of every curry.' },
  { g: 'ચા મસાલો', e: 'Tea Masala', weight: '250gm', price: 340, cat: 'masala-powders', img: IMG.teamasala, feat: true, rating: 4.8, desc: 'Aromatic chai masala with cardamom, ginger, clove and cinnamon for perfect masala chai.' },
  { g: 'ગરમ મસાલો (ALL IN ONE)', e: 'Garam Masala', weight: '250gm', price: 100, cat: 'masala-powders', img: IMG.garam, rating: 4.6, desc: 'All-in-one garam masala — a ready blend of premium whole spices, ground fresh.' },

  // ===== Chilli (4) =====
  { g: 'મરચું પાવડર (દેદંકટ)', e: 'Regular Chilli Powder', weight: '1kg', price: 380, mrp: 500, cat: 'chilli', img: IMG.chilliRed, feat: true, rating: 4.6, desc: 'Regular red chilli powder with balanced heat and bright colour for everyday cooking.' },
  { g: 'તીખાલાલ મરચું', e: 'Tikhalal Chilli', weight: '1kg', price: 420, cat: 'chilli', img: IMG.chilliRed, rating: 4.5, desc: 'Tikhalal chilli — sharp and hot red chilli powder for spicy dishes.' },
  { g: 'રેશમ પટ્ટી મરચું', e: 'Resham Patti Chilli (Medium)', weight: '1kg', price: 420, cat: 'chilli', img: IMG.chilliResham, rating: 4.5, desc: 'Resham patti chilli — medium heat with deep red colour, great for gravies.' },
  { g: 'કાશ્મીરી મરચું', e: 'Kashmiri Chilli', weight: '1kg', price: 800, cat: 'chilli', img: IMG.chilliKashmiri, feat: true, rating: 4.9, desc: 'Premium Kashmiri chilli — vibrant red colour with mild heat. Perfect for colour and flavour.' },

  // ===== Hing (3) =====
  { g: 'સ્ટ્રોંગ હિંગ', e: 'Strong Hing (Bandhani)', weight: '250gm', price: 340, mrp: 470, cat: 'hing', img: IMG.hingSolid, feat: true, rating: 4.8, desc: 'Strong bandhani hing (asafoetida) — intense aroma, just a pinch transforms any dish.' },
  { g: 'સ્પે. હિંગ', e: 'Special Hing (Essence of Unjha)', weight: '250gm', price: 130, mrp: 220, cat: 'hing', img: IMG.hingPowder, rating: 4.6, desc: 'Special Unjha hing powder — the essence of Unjha, famous for its pure asafoetida.' },
  { g: 'સ્ટ્રોંગ હિંગ ગાંગડા', e: 'Hari Special Strong Hing', weight: '250gm', price: 340, cat: 'hing', img: IMG.hingSolid, rating: 4.7, desc: 'Hari special strong hing in lump form — pure and potent for authentic flavour.' },

  // ===== Whole Spices (15) =====
  { g: 'જીરું (હરિ)', e: 'Jeera — Sortex & Machine Clean', weight: '1kg', price: 310, mrp: 450, cat: 'whole-spices', img: IMG.jeera, feat: true, rating: 4.8, desc: 'Sortex-cleaned Hari jeera (cumin seeds) — premium grade, hand-selected for aroma.' },
  { g: 'જીરું (BM)', e: 'Jeera — BM Brand', weight: '1kg', price: 340, mrp: 625, cat: 'whole-spices', img: IMG.jeera, rating: 4.7, desc: 'BM brand premium jeera — extra bold cumin seeds with intense flavour.' },
  { g: 'શાહ જીરું', e: 'Shah Jeera', weight: '200gm', price: 300, mrp: 475, cat: 'whole-spices', img: IMG.shahjeera, rating: 4.6, desc: 'Shah jeera (black cumin) — darker, sweeter cumin for biryani and rich curries.' },
  { g: 'ધાણા દાળ', e: 'Dhana Dal', weight: '500gm', price: 210, cat: 'whole-spices', img: IMG.dhanadal, feat: true, rating: 4.7, desc: 'Roasted dhana dal — crunchy coriander seeds, a favourite mouth freshener and cooking ingredient.' },
  { g: 'ધાણા', e: 'Dhana (Coriander)', weight: '1kg', price: 250, mrp: 300, cat: 'whole-spices', img: IMG.dhana, rating: 4.6, desc: 'Whole coriander seeds — fresh aroma, essential for masalas and pickles.' },
  { g: 'રાઈ ખમણાં', e: 'Rai Khamana', weight: '1kg', price: 120, mrp: 150, cat: 'whole-spices', img: IMG.rai, rating: 4.5, desc: 'Cracked yellow mustard (rai khemana) for tadka, pickles and chutneys.' },
  { g: 'સ્પે. હરિ રાઈ ખમણાં', e: 'Special Hari Rai', weight: '500gm', price: 140, mrp: 180, cat: 'whole-spices', img: IMG.rai, rating: 4.5, desc: 'Special Hari cracked mustard — premium grade for pickling and tempering.' },
  { g: 'મેથી', e: 'Methi', weight: '1kg', price: 120, mrp: 150, cat: 'whole-spices', img: IMG.methi, rating: 4.5, desc: 'Whole methi (fenugreek) seeds — slightly bitter, essential for masalas and pickles.' },
  { g: 'અજમો', e: 'Ajmo (Ajwain)', weight: '500gm', price: 200, mrp: 300, cat: 'whole-spices', img: IMG.ajwain, feat: true, rating: 4.6, desc: 'Ajmo (ajwain/carom seeds) — pungent and digestive, perfect for parathas and snacks.' },
  { g: 'મીડિયમ વરિયાળી', e: 'Medium Variyali', weight: '1kg', price: 360, mrp: 450, cat: 'whole-spices', img: IMG.variya, rating: 4.6, desc: 'Medium fennel seeds (variya/saunf) — sweet aroma for mukhvas, curries and sweets.' },
  { g: 'લખનવી વરિયાળી', e: 'Lucknowi Variyali', weight: '1kg', price: 360, mrp: 450, cat: 'whole-spices', img: IMG.variya, rating: 4.7, desc: 'Premium Lucknowi fennel seeds — extra long, sweet and aromatic.' },
  { g: 'સુવા', e: 'Suva (Dill Seeds)', weight: '500gm', price: 90, mrp: 125, cat: 'whole-spices', img: IMG.suva, rating: 4.4, desc: 'Suva (dill seeds) — aromatic seeds for pickles, masalas and digestive preparations.' },
  { g: 'કલોંજી', e: 'Kalonji (Onion Seeds)', weight: '250gm', price: 120, mrp: 150, cat: 'whole-spices', img: IMG.kalonji, rating: 4.5, desc: 'Kalonji (nigella/onion seeds) — peppery flavour for naan, pickles and curries.' },
  { g: 'કોકમ ફૂલ', e: 'Kokum Ful', weight: '250gm', price: 240, cat: 'whole-spices', img: IMG.kokum, rating: 4.6, desc: 'Dried kokum fruit — tangy and cooling, key for Gujarati and Konkani curries and solkadi.' },
  { g: 'કેસર', e: 'Kesar (Kashmiri Pure Saffron)', weight: '1gm', price: 350, mrp: 580, cat: 'whole-spices', img: IMG.kesar, feat: true, rating: 4.9, desc: 'Pure Kashmiri saffron (kesar) — deep red threads with intense aroma. A pinch for royalty.' },

  // ===== Seeds & Dry Fruits (12) =====
  { g: 'સૂર્યમુખી ના બીજ', e: 'Sunflower Seeds', weight: '250gm', price: 70, cat: 'seeds-dry-fruits', img: IMG.sunflower, rating: 4.5, desc: 'Premium sunflower seeds — rich in vitamin E and healthy fats. Great for snacking and salads.' },
  { g: 'ચિયા સીડ્સ', e: 'Chia Seeds', weight: '250gm', price: 90, cat: 'seeds-dry-fruits', img: IMG.chia, feat: true, rating: 4.7, desc: 'Nutrient-dense chia seeds — high in fibre and omega-3. Add to water, smoothies or yoghurt.' },
  { g: 'પમ્પકીન સીડ્સ', e: 'Pumpkin Seeds', weight: '250gm', price: 150, cat: 'seeds-dry-fruits', img: IMG.pumpkin, rating: 4.6, desc: 'Crunchy pumpkin seeds — rich in magnesium and zinc. A healthy, tasty snack.' },
  { g: 'મિક્સ સીડ્સ', e: 'Mix Seeds', weight: '250gm', price: 190, cat: 'seeds-dry-fruits', img: IMG.mixseeds, feat: true, rating: 4.7, desc: 'A wholesome mix of sunflower, pumpkin, chia and flax seeds. Power-packed nutrition.' },
  { g: 'તકમરિયા', e: 'Takmariya (Basil Seeds)', weight: '250gm', price: 90, cat: 'seeds-dry-fruits', img: IMG.basil, rating: 4.6, desc: 'Takmariya (sabja/basil seeds) — cooling seeds for falooda, sherbets and desserts.' },
  { g: 'ડ્રાય ક્રેનબેરી', e: 'Dried Cranberries', weight: '250gm', price: 160, mrp: 280, cat: 'seeds-dry-fruits', img: IMG.cranberry, rating: 4.6, desc: 'Sweet-tart dried cranberries — perfect for baking, salads and snacking.' },
  { g: 'ડ્રાય સ્ટ્રોબેરી', e: 'Dried Strawberry', weight: '250gm', price: 210, mrp: 390, cat: 'seeds-dry-fruits', img: IMG.strawberry, rating: 4.6, desc: 'Chewy dried strawberries — naturally sweet, great for snacks and desserts.' },
  { g: 'ડ્રાય બ્લુબેરી', e: 'Dried Blueberry', weight: '250gm', price: 360, mrp: 630, cat: 'seeds-dry-fruits', img: IMG.blueberry, feat: true, rating: 4.7, desc: 'Antioxidant-rich dried blueberries — sweet and tangy, perfect for muffins and muesli.' },
  { g: 'ડ્રાય કીવી', e: 'Dried Kiwi', weight: '250gm', price: 170, mrp: 210, cat: 'seeds-dry-fruits', img: IMG.kiwi, rating: 4.5, desc: 'Tangy-sweet dried kiwi slices — a vitamin-C rich healthy snack.' },
  { g: 'ડ્રાય મેંગો', e: 'Dried Mango', weight: '250gm', price: 190, mrp: 315, cat: 'seeds-dry-fruits', img: IMG.mango, rating: 4.6, desc: 'Naturally sweet dried mango slices — tropical flavour in every bite.' },
  { g: 'ડ્રાય પાઈનેપલ', e: 'Dried Pineapple', weight: '250gm', price: 160, mrp: 240, cat: 'seeds-dry-fruits', img: IMG.pineapple, rating: 4.5, desc: 'Sweet dried pineapple rings — a chewy, tropical treat.' },
  { g: 'ડ્રાય ફ્રૂટ મિક્સ', e: 'Dried Fruitalicious Mix', weight: '250gm', price: 210, mrp: 280, cat: 'seeds-dry-fruits', img: IMG.mixdry, feat: true, rating: 4.7, desc: 'A premium mix of dried cranberry, blueberry, kiwi, mango and more. A fruity feast.' },

  // ===== Fruit Bars (5) =====
  { g: 'નો શુગર ફ્રૂટ બાર્સ', e: 'No Added Sugar Fruit Bars (Apple, Mango, Guava)', weight: 'Pack', price: 370, mrp: 400, cat: 'fruit-bars', img: IMG.fbBars, feat: true, rating: 4.8, desc: 'Healthy fruit bars with no added sugar — real fruit goodness of apple, mango and guava.' },
  { g: 'મિક્સ ફ્રૂટ બાર્સ', e: 'Mix Fruits Bars', weight: '72 pcs', price: 340, mrp: 360, cat: 'fruit-bars', img: IMG.fbBars, rating: 4.6, desc: '72 pieces of mixed fruit bars — a delightful assortment of fruit flavours.' },
  { g: 'ઈમલી બાર', e: 'Tamarind Blast Fruit Bars', weight: '72 pcs', price: 340, mrp: 360, cat: 'fruit-bars', img: IMG.fbTamarind, rating: 4.6, desc: 'Tangy tamarind blast fruit bars — sweet, sour and spicy in every bite.' },
  { g: 'મેંગો ફ્રૂટ બાઈટ્સ', e: 'Mango Fruit Bites', weight: '20 bites', price: 80, mrp: 90, cat: 'fruit-bars', img: IMG.fbMango, rating: 4.5, desc: 'Chewy mango fruit bites — burst of mango flavour, perfect on-the-go snack.' },
  { g: 'ઓરેન્જ બાઈટ્સ', e: 'Orange Bites', weight: '20 bites', price: 80, mrp: 90, cat: 'fruit-bars', img: IMG.fbOrange, rating: 4.5, desc: 'Citrusy orange fruit bites — tangy and sweet, a refreshing treat.' },

  // ===== Farali & Instant Mix (6) =====
  { g: 'મોરૈયો (સાયકલ બ્રાન્ડ)', e: 'Moraiyo — Cycle Brand', weight: '1kg', price: 280, mrp: 340, cat: 'farali-instant', img: IMG.moraiyo, feat: true, rating: 4.7, desc: 'Cycle brand moraiyo (barnyard millet) — premium quality for farali upma and vrat recipes.' },
  { g: 'સાબુદાણા', e: 'Sabudana', weight: '1kg', price: 100, mrp: 200, cat: 'farali-instant', img: IMG.sabudana, rating: 4.6, desc: 'Premium sabudana (tapioca pearls) — perfect for sabudana khichdi, vada and kheer.' },
  { g: 'સિંધવ', e: 'Rock Salt (Sindhav)', weight: '1kg', price: 50, cat: 'farali-instant', img: IMG.rocksalt, rating: 4.5, desc: 'Pure rock salt (sindhav) — the only salt allowed during fasts. Pure and mineral-rich.' },
  { g: 'ગોટા બેસન (મિક્ષ)', e: 'Gota Besan Mix', weight: '400gm', price: 50, mrp: 85, cat: 'farali-instant', img: IMG.besan, rating: 4.5, desc: 'Ready gota besan mix — just add water and fry perfect gota. Quick and tasty.' },
  { g: 'ખમણ બેસન', e: 'Khaman Besan', weight: '400gm', price: 55, mrp: 85, cat: 'farali-instant', img: IMG.besan, rating: 4.6, desc: 'Ready khaman besan mix — fluffy, soft khaman in minutes. Authentic Gujarati taste.' },
  { g: 'પાણી પૂરી કિટ', e: 'Pani Puri Kit', weight: '50 pcs', price: 60, cat: 'farali-instant', img: IMG.panipuri, feat: true, rating: 4.7, desc: 'Complete pani puri kit — puris, spicy pani and sweet chutney. Just assemble and enjoy!' },

  // ===== Ayurvedic (4) =====
  { g: 'ઇસબગુલની ભૂસી', e: 'Sat Isabgol', weight: '1kg', price: 960, mrp: 1200, cat: 'ayurvedic', img: IMG.isabgol, feat: true, rating: 4.8, desc: 'Premium Sat Isabgol (psyllium husk) — natural fibre for digestive health and regularity.' },
  { g: 'કડવાની ફાકી', e: 'Kadvani Faki', weight: '80gm', price: 30, cat: 'ayurvedic', img: IMG.isabgol, rating: 4.4, desc: 'Kadvani faki — traditional Ayurvedic digestive powder for daily wellness.' },
  { g: 'ગુંદ કતીરા', e: 'Gond Katira', weight: '100gm', price: 70, mrp: 120, cat: 'ayurvedic', img: IMG.gond, rating: 4.6, desc: 'Gond katira (tragacanth gum) — cooling natural gum for summer drinks and desserts.' },
  { g: 'આમ પન્ના', e: 'Aam Panna Mix', weight: '500gm', price: 170, mrp: 190, cat: 'ayurvedic', img: IMG.aampanna, feat: true, rating: 4.7, desc: 'Aam panna mix — tangy raw mango drink powder, cooling and refreshing for summers.' },
]

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
}

async function main() {
  console.log('Seeding Hari Masala — 9 categories, 69 products...')

  await db.settings.upsert({
    where: { id: 'default' },
    update: {
      storeName: 'Hari Masala',
      storeTagline: 'Pure Spices, Mukhvas & More — From Unjha',
      whatsappNumber: '919879873113',
      freeShipThreshold: 499,
      adminPin: '1234',
      heroImage: HERO_IMG,
      announcement: 'Free delivery on orders above ₹499 • Order on WhatsApp • Cash on delivery',
    },
    create: {
      id: 'default',
      storeName: 'Hari Masala',
      storeTagline: 'Pure Spices, Mukhvas & More — From Unjha',
      whatsappNumber: '919879873113',
      freeShipThreshold: 499,
      adminPin: '1234',
      heroImage: HERO_IMG,
      announcement: 'Free delivery on orders above ₹499 • Order on WhatsApp • Cash on delivery',
    },
  })

  // Check if categories already exist before seeding to prevent overwriting
  const existingCategories = await db.category.count()
  if (existingCategories > 0) {
    console.log('Categories already exist, skipping seed to prevent data loss.')
    return
  }
  
  // Create categories
  const catMap: Record<string, string> = {}
  for (const c of categories) {
    const cat = await db.category.create({ data: c })
    catMap[c.slug] = cat.id
  }

  // Create products
  let i = 0
  for (const p of products) {
    i++
    await db.product.create({
      data: {
        name: p.e,
        gujaratiName: p.g,
        slug: slugify(p.e) + '-' + i,
        description: p.desc,
        price: p.price,
        mrp: p.mrp ?? p.price,
        weight: p.weight,
        categoryId: catMap[p.cat],
        image: p.img,
        stock: p.stock ?? 60,
        featured: !!p.feat,
        active: true,
        rating: p.rating ?? 4.5,
      },
    })
  }

  console.log(`✓ Seeded ${categories.length} categories and ${products.length} products.`)
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(async () => { await db.$disconnect() })
