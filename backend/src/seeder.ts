import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './config/db';
import { Category } from './models/Category';
import { Product } from './models/Product';
import { Coupon } from './models/Coupon';
import { User } from './models/User';
import { Order } from './models/Order';

const categories = [
  { name: "Woody & Earthy", slug: "woody-earthy", description: "Rich sandalwood, aged cedarwood, smoky birch and earthy vetiver accords", icon: "TreePine" },
  { name: "Floral & Botanical", slug: "floral-botanical", description: "Grasse Rose de Mai, midnight jasmine, radiant neroli and French orris", icon: "Flower2" },
  { name: "Amber & Resin", slug: "amber-resin", description: "Opulent golden amber, raw benzoin, sacred incense and Madagascar vanilla", icon: "Flame" },
  { name: "Citrus & Solar", slug: "citrus-solar", description: "Sparkling Calabrian bergamot, green petitgrain, sea salt and solar blooms", icon: "Sun" },
  { name: "Gourmand & Spices", slug: "gourmand-spices", description: "Toasted almond, saffron, roasted tonka bean and rich Bourbon vanilla", icon: "Sparkles" }
];

const coupons = [
  { code: "ODORATUS10", discountType: "percentage", discountValue: 10, minOrderAmount: 150, expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
  { code: "SOLSTICE20", discountType: "percentage", discountValue: 20, minOrderAmount: 250, maxDiscountAmount: 80, expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
  { code: "ATELIER30", discountType: "fixed", discountValue: 30, minOrderAmount: 300, expiresAt: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000) },
  { code: "HAUTE50", discountType: "fixed", discountValue: 50, minOrderAmount: 500, expiresAt: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000) },
  { code: "VIP10", discountType: "percentage", discountValue: 10, minOrderAmount: 100, maxDiscountAmount: 50, expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) }
];

const products = [
  {
    name: "Santal Parchment",
    subtitle: "Australian Sandalwood • Tuscan Leather • French Orris",
    slug: "santal-parchment",
    category: "Woody & Earthy",
    archetype: "Woody",
    concentration: "Extrait de Parfum (30% Conc.)",
    volume: "50ml / 1.7 fl.oz",
    brand: "Odoratus",
    price: 280,
    oldPrice: 320,
    rating: 4.9,
    reviewsCount: 54,
    stock: 18,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80"
    ],
    description: "An evocative olfactory homage to ancient manuscript ateliers. Opening with dry cardamom and sparkling Italian bergamot, descending into a velvety heart of Florentine orris and warm leather, anchored on creamy sustainable Australian sandalwood.",
    features: [
      "30% Extrait Concentration for 16+ Hours Sillage",
      "Sustainably Distilled Australian Sandalwood",
      "Includes 2 Complimentary 2ml Discovery Vials",
      "Handcrafted Heavy-Weighted Smoked Flacon"
    ],
    notes: {
      top: ["Italian Bergamot", "Pink Peppercorn", "Guatemala Cardamom"],
      heart: ["Florentine Orris Butter", "Tuscan Leather", "Cedar Needles"],
      base: ["Australian Sandalwood", "Virginia Cedarwood", "Grey Ambergris"]
    },
    isFeatured: true,
    reviews: [
      { name: "Elena Rostova", rating: 5, comment: "The drydown is breathtaking. Creamy sandalwood with a refined papery leather touch." },
      { name: "Henri de Beaufort", rating: 5, comment: "Pure masterclass in perfumery. Sillage lasts from sunrise to deep evening." }
    ]
  },
  {
    name: "Velvet Noir Fumé",
    subtitle: "Smoked Birch • Black Frankincense • Ambergris",
    slug: "velvet-noir-fume",
    category: "Amber & Resin",
    archetype: "Smoky",
    concentration: "Extrait de Parfum (32% Conc.)",
    volume: "50ml / 1.7 fl.oz",
    brand: "Odoratus",
    price: 320,
    oldPrice: 360,
    rating: 5.0,
    reviewsCount: 38,
    stock: 12,
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Mysterious and regal. A nocturnal journey through dark cathedral woods and ancient incense braziers. Smoked Russian birch blends with black pepper, resinous elemi, and dark amber for an intoxicating trail.",
    features: [
      "Rich Smoked Birch & Somalian Frankincense",
      "Over 14-Hour Lasting Nocturnal Presence",
      "Hand-polished Obsidian Black Lacquered Bottle",
      "Signed Botanical Batch Certificate"
    ],
    notes: {
      top: ["Tellicherry Black Pepper", "Elemi Resin", "Coriander Seed"],
      heart: ["Somalian Frankincense", "Smoked Birch Tar", "Guaiacwood"],
      base: ["Dark Fossilized Amber", "Assam Oud Extract", "Roasted Tonka"]
    },
    isFeatured: true,
    reviews: [
      { name: "Alexander K.", rating: 5, comment: "Intensely elegant. Like velvet drenched in holy smoke." }
    ]
  },
  {
    name: "Fleur Blanche Solstice",
    subtitle: "Solar Tuberose • Jasmine Sambac • Golden Neroli",
    slug: "fleur-blanche-solstice",
    category: "Floral & Botanical",
    archetype: "Floral",
    concentration: "Extrait de Parfum (28% Conc.)",
    volume: "50ml / 1.7 fl.oz",
    brand: "Odoratus",
    price: 260,
    oldPrice: 290,
    rating: 4.8,
    reviewsCount: 46,
    stock: 22,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80"
    ],
    description: "The euphoria of solstice daylight captured in nectar. Night-blooming Indian tuberose interlaces with sun-kissed Grasse jasmine, luminous solar aldehydes, and a silky bed of golden sandalwood.",
    features: [
      "Hand-picked Night Tuberose from Mysore",
      "Luminous Sillage with Creamy Solar Warmth",
      "Eco-Friendly Glass Bottle with 24k Gold Lettering",
      "Zero Synthetic Phthalates or Stabilizers"
    ],
    notes: {
      top: ["Solar Aldehydes", "Moroccan Neroli", "Green Pear"],
      heart: ["Mysore Tuberose Absolute", "Night-blooming Jasmine", "Ylang Ylang"],
      base: ["Sandalwood Cream", "Clean Cashmere Musk", "White Amber"]
    },
    isFeatured: true,
    reviews: [
      { name: "Camille Laurent", rating: 5, comment: "Radiant, feminine, and sophisticated without being overpowering." }
    ]
  },
  {
    name: "Citrus Sauvage Vert",
    subtitle: "Calabrian Bergamot • Wild Basil • Haitian Vetiver",
    slug: "citrus-sauvage-vert",
    category: "Citrus & Solar",
    archetype: "Fresh",
    concentration: "Eau de Parfum Intense (22% Conc.)",
    volume: "100ml / 3.4 fl.oz",
    brand: "Odoratus",
    price: 240,
    oldPrice: 275,
    rating: 4.9,
    reviewsCount: 33,
    stock: 30,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80"
    ],
    description: "A burst of wild Mediterranean morning mist. Crushed green basil leaves, sun-drenched bergamot rinds, and crisp sea salt minerals rest atop an earthy foundation of vetiver root and driftwood.",
    features: [
      "Cold-Pressed Reggio Calabria Bergamot",
      "Invigorating Mineral & Coastal Sillage",
      "Generous 100ml Heavy Glass Flacon",
      "Ideal for Daytime Reverie and Warm Climate"
    ],
    notes: {
      top: ["Calabrian Bergamot", "Green Lemon", "Wild Crushed Basil"],
      heart: ["Mediterranean Sea Salt", "Orange Blossom", "Juniper Berry"],
      base: ["Haitian Vetiver", "French Oakmoss", "Sun-Bleached Cedar"]
    },
    isFeatured: true,
    reviews: []
  },
  {
    name: "Rose Impériale de Mai",
    subtitle: "Centifolia Rose de Mai • Saffron • Smoked Olibanum",
    slug: "rose-imperiale-de-mai",
    category: "Floral & Botanical",
    archetype: "Floral",
    concentration: "Extrait de Parfum (30% Conc.)",
    volume: "50ml / 1.7 fl.oz",
    brand: "Odoratus",
    price: 295,
    oldPrice: 335,
    rating: 4.9,
    reviewsCount: 29,
    stock: 15,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80"
    ],
    description: "An aristocratic rose sculpted with crimson saffron and incense. Distilled from rare May centifolia roses harvested at dawn in Grasse, elevated by spicy saffron threads and a deep amberwood spine.",
    features: [
      "Grasse Centifolia Roses Harvested at Dawn",
      "Opulent Saffron & Velvet Patchouli Base",
      "Artisanal Micro-Batch Numbered Series",
      "Includes Silk Travel Pouch"
    ],
    notes: {
      top: ["Lychee Nectar", "Red Saffron", "Pink Peppercorn"],
      heart: ["Centifolia Rose de Mai", "Bulgarian Damask Rose", "Taif Rose"],
      base: ["Indonesian Patchouli", "Smoked Olibanum", "Golden Amberwood"]
    },
    isFeatured: false,
    reviews: []
  },
  {
    name: "Ambre Nocturne",
    subtitle: "Bourbon Vanilla • Benzoin • Spiced Tobacco",
    slug: "ambre-nocturne",
    category: "Amber & Resin",
    archetype: "Amber",
    concentration: "Extrait de Parfum (33% Conc.)",
    volume: "50ml / 1.7 fl.oz",
    brand: "Odoratus",
    price: 310,
    oldPrice: 350,
    rating: 5.0,
    reviewsCount: 41,
    stock: 16,
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80"
    ],
    description: "An intoxicating nectar of warm golden amber, aged spiced rum, and cured tobacco leaves steeped in double-distilled Madagascar Bourbon vanilla pods.",
    features: [
      "Double-distilled Madagascar Vanilla Bean",
      "Warm Intimate Sillage for Nocturnal Evenings",
      "Lacquered Amber-Hued Heavy Glass Flacon",
      "Includes 2 Luxury Atomizer Samples"
    ],
    notes: {
      top: ["Aged Dark Rum", "Ceylon Cinnamon Bark", "Nutmeg"],
      heart: ["Siam Benzoin", "Tobacco Blossom", "Labdanum"],
      base: ["Madagascar Bourbon Vanilla", "Raw Cocoa", "Amber Resin"]
    },
    isFeatured: true,
    reviews: []
  },
  {
    name: "Le Jardin d'Or Solstice",
    subtitle: "Bitter Orange • Solar Neroli • Honeyed Amber",
    slug: "le-jardin-dor-solstice",
    category: "Citrus & Solar",
    archetype: "Fresh",
    concentration: "Extrait de Parfum (30% Conc.)",
    volume: "100ml / 3.4 fl.oz",
    brand: "Odoratus",
    price: 340,
    oldPrice: 390,
    rating: 5.0,
    reviewsCount: 52,
    stock: 14,
    image: "https://images.unsplash.com/photo-1583445013765-46c20c4a6772?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1583445013765-46c20c4a6772?w=800&auto=format&fit=crop&q=80"
    ],
    description: "The crowning creation of the Solstice Collection. Golden rays over a Mediterranean terrace lined with orange trees, wild ginger blooms, and golden beeswax amber.",
    features: [
      "Signature Solstice Botanical Blend",
      "Special Edition 100ml Heavy Collector Flacon",
      "Ultra-Luxurious 18+ Hours Sillage",
      "Gold Embossed Atelier Gift Box Included"
    ],
    notes: {
      top: ["Bitter Orange Peel", "Sicilian Mandarin", "Cardamom Seed"],
      heart: ["Solar Orange Blossom", "Wild Ginger Flower", "Neroli Absolute"],
      base: ["Honeyed Amber", "Creamy Sandalwood", "Golden Musk"]
    },
    isFeatured: true,
    reviews: []
  },
  {
    name: "Oud Céleste",
    subtitle: "Vintage Assam Oud • Taif Rose • Dark Leather",
    slug: "oud-celeste",
    category: "Woody & Earthy",
    archetype: "Woody",
    concentration: "Extrait de Parfum (35% Conc.)",
    volume: "50ml / 1.7 fl.oz",
    brand: "Odoratus",
    price: 380,
    oldPrice: 420,
    rating: 5.0,
    reviewsCount: 35,
    stock: 9,
    image: "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=800&auto=format&fit=crop&q=80"
    ],
    description: "A majestic symphony of vintage aged Assam Agarwood, velvety Taif rose petals, and hand-tanned saddle leather. Regal, deep, and utterly unforgettable.",
    features: [
      "12-Year Aged Natural Assam Agarwood",
      "Highest Concentration (35% Pure Extrait)",
      "Smoked Jet Black Heavy Crystal Bottle",
      "Individually Numbered Flacon Edition"
    ],
    notes: {
      top: ["Iranian Red Saffron", "Italian Bergamot", "Thyme"],
      heart: ["Aged Assam Oud", "Taif Rose Absolute", "Cypriol"],
      base: ["Dark Saddle Leather", "Castoreum", "Birch Tar"]
    },
    isFeatured: false,
    reviews: []
  },
  {
    name: "Iris Céleste d'Or",
    subtitle: "Florentine Orris Root • Violet Leaf • Cashmere Musks",
    slug: "iris-celeste-dor",
    category: "Floral & Botanical",
    archetype: "Floral",
    concentration: "Extrait de Parfum (29% Conc.)",
    volume: "50ml / 1.7 fl.oz",
    brand: "Odoratus",
    price: 305,
    oldPrice: 345,
    rating: 4.9,
    reviewsCount: 37,
    stock: 14,
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&auto=format&fit=crop&q=80"],
    description: "The crown jewel of Italian perfumery. 3-year aged Florentine orris butter blended with cool morning dew, crisp violet leaves, and a soft powdery halo of white cashmere.",
    features: [
      "3-Year Aged Tuscan Orris Rhizome",
      "Silken Powdery Sillage for Quiet Luxury",
      "Frosted Crystal Flacon with Gold Crest",
      "Complimentary Discovery Vials Included"
    ],
    notes: {
      top: ["Morning Dew Accord", "Italian Angelica", "Pink Pepper"],
      heart: ["Florentine Orris Butter", "French Violet Leaves", "Heliotrope"],
      base: ["White Cashmere", "Ambrette Seed", "Soft Cedarwood"]
    },
    isFeatured: true,
    reviews: []
  },
  {
    name: "Bois de Kyoto",
    subtitle: "Japanese Hinoki • Smoked Cedar • Sacred Incense",
    slug: "bois-de-kyoto",
    category: "Woody & Earthy",
    archetype: "Woody",
    concentration: "Extrait de Parfum (31% Conc.)",
    volume: "50ml / 1.7 fl.oz",
    brand: "Odoratus",
    price: 290,
    oldPrice: 330,
    rating: 5.0,
    reviewsCount: 44,
    stock: 16,
    image: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=800&auto=format&fit=crop&q=80"],
    description: "A contemplative stroll through Kyoto temple courtyards at dusk. Resinous Japanese Hinoki wood mingles with meditative temple incense, green moss, and mountain cedar.",
    features: [
      "Sustainable Japanese Hinoki Wood Distillate",
      "Zen Meditative Accord for Deep Stillness",
      "Minimalist Dark Smoked Glass Flacon",
      "Numbered Harvest Batch"
    ],
    notes: {
      top: ["Japanese Yuzu", "Green Cypress", "Black Cardamom"],
      heart: ["Hinoki Wood", "Kyoto Temple Incense", "Dry Pine Needles"],
      base: ["Smoked Cedarwood", "Tree Moss", "Ambergris"]
    },
    isFeatured: true,
    reviews: []
  },
  {
    name: "Tabac Impérial Bourbon",
    subtitle: "Havana Tobacco Leaf • Roasted Tonka • Vanilla Caviar",
    slug: "tabac-imperial-bourbon",
    category: "Gourmand & Spices",
    archetype: "Amber",
    concentration: "Extrait de Parfum (34% Conc.)",
    volume: "50ml / 1.7 fl.oz",
    brand: "Odoratus",
    price: 335,
    oldPrice: 375,
    rating: 5.0,
    reviewsCount: 62,
    stock: 11,
    image: "https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?w=800&auto=format&fit=crop&q=80"],
    description: "Opulent and addictive. Cured blond tobacco leaves steeped in aged Bourbon oak casks, surrounded by roasted tonka bean, dark dried fruits, and vanilla caviar.",
    features: [
      "Double-aged in French Oak Casks",
      "Intensely Rich Gourmand & Tobacco Sillage",
      "Heavy Golden-Amber Glass Bottle",
      "Wax-Sealed Collector Edition"
    ],
    notes: {
      top: ["Spiced Ginger", "Star Anise", "Dried Plum"],
      heart: ["Cured Havana Tobacco Leaf", "Cacao Pod", "Tonka Bean"],
      base: ["Bourbon Vanilla Caviar", "Guaiacwood", "Honeyed Amber"]
    },
    isFeatured: true,
    reviews: []
  },
  {
    name: "Neroli Blanc de Grasse",
    subtitle: "Orange Blossom Absolute • Sea Salt • White Musk",
    slug: "neroli-blanc-de-grasse",
    category: "Citrus & Solar",
    archetype: "Fresh",
    concentration: "Eau de Parfum Intense (24% Conc.)",
    volume: "100ml / 3.4 fl.oz",
    brand: "Odoratus",
    price: 250,
    oldPrice: 285,
    rating: 4.8,
    reviewsCount: 31,
    stock: 25,
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&auto=format&fit=crop&q=80"],
    description: "Sunlight glistening over Provence citrus groves. Pristine white orange blossoms hand-gathered at first light, balanced by crystalline sea salt and airy white musk.",
    features: [
      "Cold-extracted Grasse Orange Blossom",
      "Effortlessly Fresh Daily Signature",
      "Generous 100ml Heavy Glass Bottle",
      "Zero Harsh Synthetic Fixatives"
    ],
    notes: {
      top: ["Mandarin Zest", "Green Petitgrain", "Neroli Petals"],
      heart: ["Orange Blossom Absolute", "French Lavender", "Sea Minerals"],
      base: ["White Ambergris", "Clean Musks", "Bleached Driftwood"]
    },
    isFeatured: false,
    reviews: []
  },
  {
    name: "Cardamom Manuscript",
    subtitle: "Black Cardamom • Roasted Hazelnut • Cashmere Woods",
    slug: "cardamom-manuscript",
    category: "Gourmand & Spices",
    archetype: "Woody",
    concentration: "Extrait de Parfum (30% Conc.)",
    volume: "50ml / 1.7 fl.oz",
    brand: "Odoratus",
    price: 285,
    oldPrice: 325,
    rating: 4.9,
    reviewsCount: 48,
    stock: 19,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80"],
    description: "A cozy intellectual atmosphere reminiscent of rare book archives. Aromatic green and black cardamoms pair with roasted hazelnuts and warm creamy cashmere woods.",
    features: [
      "Pure Guatemala Green Cardamom CO2",
      "Intriguing Spiced Gourmand Warmth",
      "Smoked Glass Bottle with Golden Label",
      "Includes 2 Discovery Samples"
    ],
    notes: {
      top: ["Green Cardamom", "Nutmeg", "Bergamot Rind"],
      heart: ["Roasted Hazelnut Accord", "Orris", "Dark Rum"],
      base: ["Cashmere Woods", "Creamy Sandalwood", "Brown Sugar Vanilla"]
    },
    isFeatured: false,
    reviews: []
  },
  {
    name: "Cuir Solaire d'Orient",
    subtitle: "Golden Saffron • Tuscan Suede • Sun-Baked Resins",
    slug: "cuir-solaire-dorient",
    category: "Woody & Earthy",
    archetype: "Woody",
    concentration: "Extrait de Parfum (32% Conc.)",
    volume: "50ml / 1.7 fl.oz",
    brand: "Odoratus",
    price: 315,
    oldPrice: 355,
    rating: 5.0,
    reviewsCount: 39,
    stock: 13,
    image: "https://images.unsplash.com/photo-1583445013765-46c20c4a6772?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1583445013765-46c20c4a6772?w=800&auto=format&fit=crop&q=80"],
    description: "Sun-drenched desert leather illuminated by crimson Persian saffron and radiant labdanum. Refined, daring, and richly textured.",
    features: [
      "Finest Tuscan Suede & Persian Saffron",
      "Exceptional 16+ Hour Presence",
      "Lacquered Matte Black Flacon",
      "Artisanal Certificate of Origin"
    ],
    notes: {
      top: ["Crimson Saffron", "Thyme", "Raspberry"],
      heart: ["Tuscan Suede", "Frankincense", "Jasmine"],
      base: ["Dark Amber", "Birch Tar", "Atlas Cedarwood"]
    },
    isFeatured: false,
    reviews: []
  },
  {
    name: "Vanille Noire Exquise",
    subtitle: "Smoked Vanilla Pods • Dark Cacao • Golden Benzoin",
    slug: "vanille-noire-exquise",
    category: "Gourmand & Spices",
    archetype: "Amber",
    concentration: "Extrait de Parfum (33% Conc.)",
    volume: "50ml / 1.7 fl.oz",
    brand: "Odoratus",
    price: 295,
    oldPrice: 335,
    rating: 4.9,
    reviewsCount: 56,
    stock: 17,
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80"],
    description: "An adult, sophisticated take on vanilla. Raw Bourbon vanilla beans gently smoked over cherrywood embers, enriched with bitter cocoa and golden benzoin tears.",
    features: [
      "Whole Madagascar Bourbon Vanilla Absolute",
      "Non-Syrupy Smoky Sweetness",
      "Heavy Glass Flacon with Metallic Cap",
      "Includes 2 Complimentary Samples"
    ],
    notes: {
      top: ["Bitter Almond", "Clove Bud", "Pink Pepper"],
      heart: ["Dark Cacao", "Siam Benzoin", "Tobacco Flower"],
      base: ["Smoked Bourbon Vanilla", "Guaicwood", "Tonka Bean"]
    },
    isFeatured: true,
    reviews: []
  },
  {
    name: "Vetiver Brume Sauvage",
    subtitle: "Haitian Vetiver • Pink Grapefruit • Juniper Berry",
    slug: "vetiver-brume-sauvage",
    category: "Woody & Earthy",
    archetype: "Fresh",
    concentration: "Eau de Parfum Intense (22% Conc.)",
    volume: "100ml / 3.4 fl.oz",
    brand: "Odoratus",
    price: 245,
    oldPrice: 280,
    rating: 4.8,
    reviewsCount: 28,
    stock: 22,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80"],
    description: "Earthy elegance. Haitian vetiver roots washed in cool morning rain and crisp pink grapefruit zest, underscored by crushed juniper berries and clean cedar.",
    features: [
      "Ethically Sourced Les Cayes Haitian Vetiver",
      "Crisp Clean Earthy Aura for All Occasions",
      "Generous 100ml Heavy Collector Flacon",
      "Zero Phthalates or Stabilizers"
    ],
    notes: {
      top: ["Pink Grapefruit", "Cardamom", "Bergamot"],
      heart: ["Juniper Berry", "Nutmeg", "Geranium"],
      base: ["Haitian Vetiver", "Virginia Cedar", "Oakmoss"]
    },
    isFeatured: false,
    reviews: []
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log('🔄 Cleaning old collections...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});

    console.log('🌱 Seeding 5 Modern Categories...');
    await Category.insertMany(categories);

    console.log('🌱 Seeding 5 Promo Coupons...');
    await Coupon.insertMany(coupons);

    console.log('🌱 Seeding Demo Admin & VIP Users...');
    const adminUser = await User.create({
      name: "Enterprise Admin",
      email: "admin@store.com",
      password: "admin123456",
      role: "admin",
      phone: "+1 (555) 019-2834",
      loyaltyPoints: 1250,
      vipTier: "Gold"
    });

    const standardUser = await User.create({
      name: "John Doe",
      email: "user@store.com",
      password: "user123456",
      role: "user",
      phone: "+1 (555) 837-1928",
      loyaltyPoints: 350,
      vipTier: "Silver"
    });

    console.log(`🌱 Seeding ${products.length} Premium Luxury Artisanal Perfume Flacons...`);
    const insertedProducts = await Product.insertMany(products);

    console.log('🌱 Seeding Initial Order History with Tracking...');
    await Order.create({
      user: standardUser._id,
      customerName: standardUser.name,
      customerEmail: standardUser.email,
      customerPhone: "+1 (555) 837-1928",
      shippingAddress: {
        street: "742 Evergreen Terrace, Suite 4B",
        city: "San Francisco",
        postalCode: "94107",
        country: "United States",
        notes: "Leave at front desk"
      },
      items: [
        {
          product: insertedProducts[0]._id,
          name: insertedProducts[0].name,
          quantity: 1,
          price: insertedProducts[0].price,
          image: insertedProducts[0].image
        }
      ],
      subtotal: insertedProducts[0].price,
      tax: insertedProducts[0].price * 0.05,
      shippingFee: 0,
      discount: 20,
      total: insertedProducts[0].price * 1.05 - 20,
      appliedCoupon: "WELCOME20",
      paymentMethod: "Credit Card / Visa & Mastercard",
      paymentStatus: "completed",
      orderStatus: "processing",
      trackingNumber: "ODR-EXP-487601",
      carrier: "DHL Express Maison Air",
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      timeline: [
        {
          status: "pending",
          title: "Order Registered",
          description: "Maison order placed and payment confirmed.",
          timestamp: new Date(),
          completed: true
        },
        {
          status: "processing",
          title: "Atelier Preparation",
          description: "Flacons reserved and queued for batch certification at Grasse atelier.",
          timestamp: new Date(),
          completed: true
        }
      ]
    });

    console.log(`✨ All ${products.length} products, 5 categories, 5 coupons, users, and orders seeded successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
