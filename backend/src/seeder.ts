import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './config/db';
import { Category } from './models/Category';
import { Product } from './models/Product';
import { Coupon } from './models/Coupon';
import { User } from './models/User';
import { Order } from './models/Order';

const categories = [
  { name: "Electronics", slug: "electronics", description: "Smartphones, laptops, monitors & high-performance computing gadgets", icon: "Laptop" },
  { name: "Audio & Acoustics", slug: "audio-acoustics", description: "Studio ANC headphones, wireless speakers & spatial audio DACs", icon: "Headphones" },
  { name: "Fashion & Lifestyle", slug: "fashion-lifestyle", description: "Minimalist urban streetwear, titanium eyewear & premium accessories", icon: "Shirt" },
  { name: "Home & Living", slug: "home-living", description: "Smart interior lighting, barista espresso systems & ergonomic desk gear", icon: "Home" },
  { name: "Gaming & VR", slug: "gaming-vr", description: "Pro mechanical keyboards, ultra-fast mice & next-gen spatial headsets", icon: "Gamepad" }
];

const coupons = [
  { code: "SAVE10", discountType: "percentage", discountValue: 10, minOrderAmount: 50, expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
  { code: "WELCOME20", discountType: "percentage", discountValue: 20, minOrderAmount: 100, maxDiscountAmount: 60, expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
  { code: "CASH30", discountType: "fixed", discountValue: 30, minOrderAmount: 200, expiresAt: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000) },
  { code: "PRIME50", discountType: "fixed", discountValue: 50, minOrderAmount: 350, expiresAt: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000) },
  { code: "CYBER25", discountType: "percentage", discountValue: 25, minOrderAmount: 150, maxDiscountAmount: 80, expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) }
];

const products = [
  {
    name: "Aura Pro Wireless ANC Studio Headphones",
    slug: "aura-pro-wireless-anc-headphones",
    category: "Audio & Acoustics",
    brand: "Sony / Aura",
    price: 189.99,
    oldPrice: 249.99,
    rating: 4.9,
    reviewsCount: 42,
    stock: 24,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    description: "Flagship hybrid active noise cancelling headphones with custom 40mm beryllium drivers, lossless spatial audio, and 45-hour ultra endurance battery.",
    features: ["Hybrid Active Noise Cancellation (45dB)", "45-Hour Battery Life with USB-C Fast Charge", "Lossless Hi-Res Audio & Bluetooth 5.3", "Ultra-soft Memory Foam Cushions"],
    isFeatured: true,
    reviews: [
      { name: "Alex Mercer", rating: 5, comment: "Insane soundstage and unbelievable noise cancelling. Best tech purchase this year!" },
      { name: "Sarah Jenkins", rating: 5, comment: "Pure luxury feel. The battery truly lasts all week on a single charge." }
    ]
  },
  {
    name: "Titanium Cyber Chrono Smartwatch Ultra",
    slug: "titanium-cyber-chrono-smartwatch",
    category: "Electronics",
    brand: "Nexus",
    price: 299.99,
    oldPrice: 399.99,
    rating: 4.8,
    reviewsCount: 56,
    stock: 18,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    description: "Grade-5 aerospace titanium smartwatch with Always-On Sapphire AMOLED display, dual-frequency GPS, and medical-grade bio-sensors.",
    features: ["Grade-5 Titanium & Sapphire Crystal", "100m Water Resistance (10 ATM)", "Continuous ECG & Blood Oxygen Monitoring", "Up to 14 Days Battery Life"],
    isFeatured: true,
    reviews: [
      { name: "David Kim", rating: 5, comment: "Sleek, futuristic, and battery lasts forever compared to Apple Watch." }
    ]
  },
  {
    name: "Luminary 4K OLED Ultra-Wide Curved Monitor 34-Inch",
    slug: "luminary-4k-oled-curved-monitor",
    category: "Electronics",
    brand: "Samsung / Nexus",
    price: 649.99,
    oldPrice: 799.99,
    rating: 5.0,
    reviewsCount: 68,
    stock: 8,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    description: "34-inch QD-OLED 1800R curved gaming & productivity display with 240Hz refresh rate, 0.03ms response time, and 99.3% DCI-P3 color gamut.",
    features: ["34-Inch QD-OLED Panel (3440 x 1440)", "240Hz Refresh Rate & 0.03ms Response", "USB-C 90W Power Delivery Hub", "Ambient Glow RGB Rear Backlight"],
    isFeatured: true,
    reviews: [
      { name: "Marcus Vance", rating: 5, comment: "Incredible color accuracy and deep ink blacks. Game changer for creative workflow." }
    ]
  },
  {
    name: "CyberSound Waterproof 360 Spatial Speaker",
    slug: "cybersound-waterproof-360-speaker",
    category: "Audio & Acoustics",
    brand: "JBL",
    price: 79.99,
    oldPrice: 99.99,
    rating: 4.7,
    reviewsCount: 31,
    stock: 35,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80",
    description: "360-degree omnidirectional acoustic speaker with dual neodymium bass radiators, IPX7 waterproof rating, and ambient RGB illumination.",
    features: ["IPX7 Submersible Waterproof", "360° Omnidirectional Room-filling Sound", "Dual Pass Radiators for Deep Bass", "18-Hour Continuous Playtime"],
    isFeatured: true,
    reviews: []
  },
  {
    name: "Barista Touch Espresso Machine & Grinder",
    slug: "barista-touch-espresso-machine",
    category: "Home & Living",
    brand: "DeLonghi",
    price: 349.99,
    oldPrice: 429.99,
    rating: 4.9,
    reviewsCount: 22,
    stock: 12,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80",
    description: "Precision 15-bar Italian thermo-block espresso system with integrated conical burr grinder and micro-foam steam wand for artisan coffee.",
    features: ["15-Bar Italian High-Pressure Pump", "Integrated Conical Burr Grinder (15 Settings)", "Micro-foam Commercial Steam Wand", "1.8L Removable Water Reservoir"],
    isFeatured: true,
    reviews: []
  },
  {
    name: "AirFlow Velocity Pro Carbon Running Shoes",
    slug: "airflow-velocity-pro-running-shoes",
    category: "Fashion & Lifestyle",
    brand: "Nike / Velocity",
    price: 139.99,
    oldPrice: 179.99,
    rating: 4.8,
    reviewsCount: 47,
    stock: 40,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    description: "Carbon-fiber plate ultra-responsive marathon runners featuring nitrogen-infused cushioning and seamless breathable mesh upper.",
    features: ["Full-length Carbon Fiber Energy Plate", "Nitrogen-infused Cushioning Foam", "Seamless Breathable Engineered Knit", "Durable All-weather Traction Rubber"],
    isFeatured: true,
    reviews: []
  },
  {
    name: "Minimalist Ergonomic Desk LED Lamp & Wireless Charger",
    slug: "minimalist-ergonomic-desk-lamp",
    category: "Home & Living",
    brand: "Xiaomi",
    price: 49.99,
    oldPrice: 65.00,
    rating: 4.6,
    reviewsCount: 19,
    stock: 50,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    description: "Precision aluminum architectural desk lamp with 5 color temperatures, step-less dimming, and 15W MagSafe wireless charging base.",
    features: ["15W Integrated Fast Wireless Charger", "5 Color Temperatures & Stepless Dimming", "Zero Blue Light Eye-Protection Standard", "Solid Anodized Aluminum Construction"],
    isFeatured: false,
    reviews: []
  },
  {
    name: "Aviator Titanium Polarized Sunglasses UV400",
    slug: "aviator-titanium-polarized-sunglasses",
    category: "Fashion & Lifestyle",
    brand: "Ray-Ban",
    price: 89.99,
    oldPrice: 119.99,
    rating: 4.7,
    reviewsCount: 29,
    stock: 30,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
    description: "Ultralight aerospace titanium sunglasses with 9-layer HD polarized optics and complete UV400 hydrophobic coating.",
    features: ["100% UV400 & Glare-Blocking Polarization", "Ultralight 16g Titanium Frame", "Hydrophobic & Scratch-Resistant Coating", "Includes Leather Case & Cleaning Cloth"],
    isFeatured: false,
    reviews: []
  },
  {
    name: "CyberDeck 75 Custom Wireless Mechanical Keyboard",
    slug: "cyberdeck-75-custom-mechanical-keyboard",
    category: "Gaming & VR",
    brand: "Keychron / Nexus",
    price: 159.99,
    oldPrice: 199.99,
    rating: 4.9,
    reviewsCount: 34,
    stock: 20,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    description: "Gasket-mounted CNC aluminum 75% mechanical keyboard with customizable OLED mini-display, pre-lubed linear switches, and hot-swap PCB.",
    features: ["CNC Anodized Aluminum Chassis", "Built-in OLED Smart Screen & Rotary Knob", "Tri-Mode Connectivity (2.4GHz / BT 5.2 / Type-C)", "Sound-Dampening Silicone & Poron Foam"],
    isFeatured: true,
    reviews: [
      { name: "Liam Thorne", rating: 5, comment: "Thocky, deep sound profile right out of the box. The OLED screen is super handy!" }
    ]
  },
  {
    name: "AeroPrecision Ultralight Wireless Gaming Mouse 49g",
    slug: "aeroprecision-ultralight-gaming-mouse",
    category: "Gaming & VR",
    brand: "Razer / Nexus",
    price: 119.99,
    oldPrice: 149.99,
    rating: 4.8,
    reviewsCount: 28,
    stock: 25,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
    description: "Sub-49g magnesium alloy wireless gaming mouse featuring 30K optical sensor, 8000Hz polling rate, and pure PTFE speed skates.",
    features: ["Ultralight Magnesium Alloy Shell (49g)", "30,000 DPI Precision Focus Optical Sensor", "True 8K Wireless HyperPolling Rate", "Up to 90 Hours Continuous Battery"],
    isFeatured: false,
    reviews: []
  },
  {
    name: "VoltMaster 140W GaN 4-Port Fast Desktop Charger",
    slug: "voltmaster-140w-gan-fast-charger",
    category: "Electronics",
    brand: "Anker",
    price: 69.99,
    oldPrice: 89.99,
    rating: 4.9,
    reviewsCount: 41,
    stock: 35,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
    description: "Next-gen Gallium Nitride (GaN III) high-speed charger capable of powering two MacBook Pros and two iPhones concurrently.",
    features: ["140W Single Port Max Output (PD 3.1)", "3x USB-C + 1x USB-A Simultaneous Charging", "ActiveShield 2.0 Real-time Temperature Monitor", "Compact Travel-Friendly Foldable Plug"],
    isFeatured: false,
    reviews: []
  },
  {
    name: "SpatialVision Pro VR Augmented Reality Headset",
    slug: "spatialvision-pro-vr-headset",
    category: "Gaming & VR",
    brand: "Meta / Nexus",
    price: 499.99,
    oldPrice: 599.99,
    rating: 4.8,
    reviewsCount: 39,
    stock: 14,
    image: "https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=800&auto=format&fit=crop&q=80",
    description: "Dual 4K Micro-OLED spatial reality headset with full-color passthrough, iris eye tracking, and precise hand gesture control.",
    features: ["Dual 4K Micro-OLED Displays (4320 x 2160)", "High-Resolution Color Spatial Passthrough", "Eye & Hand Motion Tracking without Controllers", "Ultra-Balanced Breathable Headband"],
    isFeatured: true,
    reviews: []
  },
  {
    name: "Obsidian Modular Tactical Urban Backpack 25L",
    slug: "obsidian-modular-tactical-backpack",
    category: "Fashion & Lifestyle",
    brand: "Peak Design / Nexus",
    price: 169.99,
    oldPrice: 219.99,
    rating: 4.9,
    reviewsCount: 26,
    stock: 22,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    description: "Weatherproof 1000D Cordura backpack with magnetic Fidlock buckles, dedicated 16-inch padded tech compartment, and modular dividers.",
    features: ["1000D Waterproof Recycled Cordura", "German Fidlock Magnetic Quick-Release Buckles", "Suspended 16-inch Laptop & Tablet Vault", "Hidden RFID Passport & AirTag Pocket"],
    isFeatured: false,
    reviews: []
  },
  {
    name: "AuraCast Spatial Soundbar & Wireless Subwoofer",
    slug: "auracast-spatial-soundbar-subwoofer",
    category: "Audio & Acoustics",
    brand: "Sonos / Nexus",
    price: 399.99,
    oldPrice: 499.99,
    rating: 4.9,
    reviewsCount: 33,
    stock: 10,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
    description: "7.1.4 Dolby Atmos spatial soundbar with upward-firing height channels, wireless 8-inch down-firing subwoofer, and eARC connectivity.",
    features: ["Dolby Atmos & DTS:X 3D Spatial Audio", "Wireless 8-Inch Subwoofer (300W Peak)", "HDMI eARC & Optical / Bluetooth 5.3", "Acoustic Room Calibration Microphone"],
    isFeatured: true,
    reviews: []
  },
  {
    name: "Nordic Minimalist Ceramic Pour-Over Kettle & Brewer",
    slug: "nordic-ceramic-pour-over-kettle",
    category: "Home & Living",
    brand: "Fellow",
    price: 89.99,
    oldPrice: 109.99,
    rating: 4.7,
    reviewsCount: 18,
    stock: 30,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    description: "Matte black precision gooseneck electric kettle with PID temperature control, stop-watch brew timer, and double-wall ceramic dripper.",
    features: ["PID Precision Temperature Regulation (±1°F)", "Gooseneck Spout for Controlled Flow Rate", "Built-in Brew Timer & LCD Screen", "Matte Heat-Resistant Nordic Ceramic Finish"],
    isFeatured: false,
    reviews: []
  },
  {
    name: "CyberPulse High-Density 25,000mAh Powerbank 100W",
    slug: "cyberpulse-25000mah-powerbank",
    category: "Electronics",
    brand: "Shargeek / Nexus",
    price: 129.99,
    oldPrice: 169.99,
    rating: 4.9,
    reviewsCount: 45,
    stock: 28,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80",
    description: "Transparent cyberpunk powerbank featuring a full-color IPS status display, 100W Power Delivery output, and airline-approved 25,000mAh capacity.",
    features: ["Transparent Cyberpunk Industrial Enclosure", "100W USB-C PD Rapid Input & Output", "Real-Time IPS Color Voltage & Battery Meter", "Airline Flight-Safe 93.5Wh Capacity"],
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

    console.log('🌱 Seeding Demo Admin & Users...');
    const adminUser = await User.create({
      name: "Enterprise Admin",
      email: "admin@store.com",
      password: "admin123456",
      role: "admin",
      phone: "+1 (555) 019-2834"
    });

    const standardUser = await User.create({
      name: "John Doe",
      email: "user@store.com",
      password: "user123456",
      role: "user",
      phone: "+1 (555) 837-1928"
    });

    console.log('🌱 Seeding 16 Premium Luxury Tech & Lifestyle Products...');
    const insertedProducts = await Product.insertMany(products);

    console.log('🌱 Seeding Initial Order History for Demo User...');
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
      orderStatus: "processing"
    });

    console.log('✨ All 16 products, 5 categories, 5 coupons, users, and orders seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
