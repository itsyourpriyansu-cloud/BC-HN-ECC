import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.reviewImage.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // Create demo admin and users
  const admin = await prisma.user.create({
    data: {
      email: "admin@alemah.com",
      passwordHash: "$2a$12$R5qVw2hP20j6Qd5nE1T4vOz9tO6E8dKpeUj3i7hW.vS.l4.T4n4.2", // bcrypt hash for 'admin123'
      name: "Alemah Admin",
      phone: "+919876543210",
      role: "ADMIN",
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      email: "user@alemah.com",
      passwordHash: "$2a$12$R5qVw2hP20j6Qd5nE1T4vOz9tO6E8dKpeUj3i7hW.vS.l4.T4n4.2", // bcrypt hash for 'admin123'
      name: "Priyansu Kumar",
      phone: "+919999999999",
      role: "USER",
      addresses: {
        create: {
          name: "Priyansu Kumar",
          phone: "+919999999999",
          street: "12, Premium Residency, Indira Nagar",
          city: "Bengaluru",
          state: "Karnataka",
          postalCode: "560038",
          country: "India",
          isDefault: true,
        },
      },
    },
  });

  console.log("Seeded users & admin account.");

  const productsData = [
    // --- BEDSHEETS ---
    {
      name: "Luxe Percale Cotton Bedsheet Set",
      description: "Crafted from 100% long-staple organic cotton, our percale sheets are cool, crisp, and matte. Designed to mimic the feel of five-star hotel bedding, they are highly breathable and get softer with every single wash.",
      category: "Bedsheets",
      fabric: "100% Organic Cotton (Percale Weave)",
      threadCount: 300,
      gsm: 120,
      careInstructions: "Machine wash cold with like colors on a gentle cycle. Tumble dry low.",
      basePrice: 2499.0,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { sku: "BS-LPC-K-IV", size: "King (108x108 inches)", color: "Ivory White", colorCode: "#F5F5F0", stock: 12, priceAdjustment: 500.0 },
        { sku: "BS-LPC-Q-IV", size: "Queen (90x108 inches)", color: "Ivory White", colorCode: "#F5F5F0", stock: 15, priceAdjustment: 0.0 },
        { sku: "BS-LPC-K-AR", size: "King (108x108 inches)", color: "Alemah Red", colorCode: "#A63D3D", stock: 8, priceAdjustment: 600.0 },
        { sku: "BS-LPC-Q-AR", size: "Queen (90x108 inches)", color: "Alemah Red", colorCode: "#A63D3D", stock: 10, priceAdjustment: 100.0 },
      ],
    },
    {
      name: "Royal Sateen Bedsheet Set",
      description: "Indulge in the silky smoothness of our Egyptian cotton sateen sheets. With an elegant luminous drape, these sheets feel luxurious against the skin, offering warmth for cool nights and rich comfort.",
      category: "Bedsheets",
      fabric: "100% Egyptian Cotton (Sateen Weave)",
      threadCount: 400,
      gsm: 130,
      careInstructions: "Warm wash, do not bleach, tumble dry low, warm iron if necessary.",
      basePrice: 3499.0,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { sku: "BS-RST-K-CR", size: "King (108x108 inches)", color: "Warm Cream", colorCode: "#EEE5D8", stock: 10, priceAdjustment: 600.0 },
        { sku: "BS-RST-Q-CR", size: "Queen (90x108 inches)", color: "Warm Cream", colorCode: "#EEE5D8", stock: 8, priceAdjustment: 0.0 },
        { sku: "BS-RST-K-ES", size: "King (108x108 inches)", color: "Espresso Brown", colorCode: "#3A2E28", stock: 7, priceAdjustment: 700.0 },
      ],
    },
    {
      name: "Heritage Linen Bedsheet Set",
      description: "Woven from certified Belgian flax, our linen bedding is pre-washed for ultimate softness. Renowned for its natural breathability and thermo-regulating properties, it is the ultimate luxury for year-round sleeping.",
      category: "Bedsheets",
      fabric: "100% Belgian Flax Linen",
      threadCount: 150,
      gsm: 160,
      careInstructions: "Machine wash cold, lay flat to dry or tumble dry low. Soft wrinkles are part of linen's natural charm.",
      basePrice: 5999.0,
      isFeatured: false,
      images: [
        "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { sku: "BS-HLN-K-NS", size: "King (108x108 inches)", color: "Natural Sand", colorCode: "#C9BBA8", stock: 5, priceAdjustment: 1000.0 },
        { sku: "BS-HLN-Q-NS", size: "Queen (90x108 inches)", color: "Natural Sand", colorCode: "#C9BBA8", stock: 5, priceAdjustment: 0.0 },
      ],
    },
    {
      name: "Tranquil Pastel Solid Bedsheet",
      description: "Perfect for secondary bedrooms and daily comfort, this single-ply long-staple combed cotton sheet features a pastel shade palette. Durable, hypoallergenic, and extremely easy to care for.",
      category: "Bedsheets",
      fabric: "100% Combed Cotton",
      threadCount: 220,
      gsm: 110,
      careInstructions: "Wash with mild detergent, bleach-safe, medium iron.",
      basePrice: 1699.0,
      isFeatured: false,
      images: [
        "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { sku: "BS-TPS-D-BL", size: "Double (90x100 inches)", color: "Powder Blue", colorCode: "#A4C2E2", stock: 20, priceAdjustment: 0.0 },
        { sku: "BS-TPS-S-BL", size: "Single (60x90 inches)", color: "Powder Blue", colorCode: "#A4C2E2", stock: 15, priceAdjustment: -400.0 },
      ],
    },

    // --- CUSHION COVERS ---
    {
      name: "Classic Diagonal Tufted Cushion Cover",
      description: "Incorporating Alemah's signature diagonal-line weave, this heavy cotton-canvas cushion cover features elegant tufted lines and micro-tassel detailing on the corners. A beautiful, tactile addition to any sofa.",
      category: "Cushion Covers",
      fabric: "Heavy Cotton Canvas",
      threadCount: undefined,
      gsm: 350,
      careInstructions: "Dry clean recommended. Spot clean with a damp cloth if necessary.",
      basePrice: 499.0,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { sku: "CC-CDT-16-AR", size: "16x16 inches", color: "Alemah Red", colorCode: "#A63D3D", stock: 50, priceAdjustment: 0.0 },
        { sku: "CC-CDT-18-AR", size: "18x18 inches", color: "Alemah Red", colorCode: "#A63D3D", stock: 40, priceAdjustment: 100.0 },
        { sku: "CC-CDT-16-IV", size: "16x16 inches", color: "Ivory Cream", colorCode: "#FBF6EE", stock: 60, priceAdjustment: 0.0 },
      ],
    },
    {
      name: "Velvet Ochre Accent Cushion Cover",
      description: "Plush, high-density velvet fabric with golden cord piping along the seams. Adds a gorgeous metallic pop and soft texture to formal living room layouts.",
      category: "Cushion Covers",
      fabric: "Premium Micro-Velvet",
      threadCount: undefined,
      gsm: 400,
      careInstructions: "Dry clean only. Gentle hand brush to restore pile.",
      basePrice: 599.0,
      isFeatured: false,
      images: [
        "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { sku: "CC-VOA-16-GD", size: "16x16 inches", color: "Gold Ochre", colorCode: "#C9A24B", stock: 35, priceAdjustment: 0.0 },
        { sku: "CC-VOA-18-GD", size: "18x18 inches", color: "Gold Ochre", colorCode: "#C9A24B", stock: 25, priceAdjustment: 100.0 },
      ],
    },
    {
      name: "Handwoven Blockprint Cushion Cover",
      description: "Made in collaboration with local block print artisans, this cover displays an intricate floral motif using natural plant dyes. Stitched onto coarse handspun cotton.",
      category: "Cushion Covers",
      fabric: "100% Handspun Khadi Cotton",
      threadCount: undefined,
      gsm: 250,
      careInstructions: "Hand wash cold separately using mild detergent. Dry in shade.",
      basePrice: 699.0,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { sku: "CC-HBP-16-IN", size: "16x16 inches", color: "Indigo Blue", colorCode: "#1B2A4A", stock: 30, priceAdjustment: 0.0 },
        { sku: "CC-HBP-16-TP", size: "16x16 inches", color: "Taupe Gray", colorCode: "#6B5B52", stock: 25, priceAdjustment: 0.0 },
      ],
    },

    // --- QUILTS & COMFORTERS ---
    {
      name: "Cloud-soft Jaipuri Cotton Razai",
      description: "Our signature Jaipuri Quilt is filled with 100% carded organic cotton. Encased in fine mulmul cotton, it is hand-quilted by master craftsmen with incredible detailing. Lightweight yet amazingly insulating.",
      category: "Quilts & Comforters",
      fabric: "Mulmul Cotton Shell, 100% Cotton Filling",
      threadCount: undefined,
      gsm: 200,
      careInstructions: "Dry clean only. Periodically air out in soft sunlight to maintain fluffiness.",
      basePrice: 3999.0,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { sku: "QC-JZR-K-IV", size: "King (90x108 inches)", color: "Ivory Print", colorCode: "#FBF6EE", stock: 10, priceAdjustment: 800.0 },
        { sku: "QC-JZR-S-IV", size: "Single (60x90 inches)", color: "Ivory Print", colorCode: "#FBF6EE", stock: 15, priceAdjustment: 0.0 },
        { sku: "QC-JZR-K-AR", size: "King (90x108 inches)", color: "Alemah Red Print", colorCode: "#A63D3D", stock: 8, priceAdjustment: 900.0 },
      ],
    },
    {
      name: "All-Season Premium Comforter",
      description: "Filled with down-alternative hypoallergenic micro-conjugate fibers, this comforter features classic box stitching to prevent shifting of the filling. Breathable, medium weight, and perfect for air-conditioned rooms.",
      category: "Quilts & Comforters",
      fabric: "Microfiber Shell, Down-Alternative Filling",
      threadCount: undefined,
      gsm: 300,
      careInstructions: "Machine wash warm, tumble dry on medium heat. Do not iron.",
      basePrice: 2899.0,
      isFeatured: false,
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { sku: "QC-ASC-K-WH", size: "King Size", color: "Classic White", colorCode: "#FFFFFF", stock: 25, priceAdjustment: 400.0 },
        { sku: "QC-ASC-D-WH", size: "Double Size", color: "Classic White", colorCode: "#FFFFFF", stock: 20, priceAdjustment: 0.0 },
      ],
    },
    {
      name: "Waffle Weave Warmth Quilt",
      description: "Featuring a deeply textured cotton waffle front and a brushed smooth cotton back. This dual-sided quilt provides optimal lightweight warmth and modern, architectural styling for the bed.",
      category: "Quilts & Comforters",
      fabric: "100% Combed Cotton Waffle",
      threadCount: undefined,
      gsm: 280,
      careInstructions: "Machine wash cold. Gentle tumble dry. Do not hang in direct hot sun.",
      basePrice: 4299.0,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { sku: "QC-WWW-K-ES", size: "King Size", color: "Espresso", colorCode: "#3A2E28", stock: 12, priceAdjustment: 500.0 },
        { sku: "QC-WWW-K-NS", size: "King Size", color: "Natural Sand", colorCode: "#C9BBA8", stock: 10, priceAdjustment: 500.0 },
      ],
    },

    // --- CURTAINS ---
    {
      name: "Minimalist Linen Sheer Curtain",
      description: "Our signature sheer curtains let soft light filter into your spaces while maintaining visual privacy. Crafted from premium Belgian flax blended with durable polyester for crease-free draping.",
      category: "Curtains",
      fabric: "Belgian Linen & Polyester Blend",
      threadCount: undefined,
      gsm: 140,
      careInstructions: "Gentle cycle machine wash in a laundry bag, hang dry while damp to release wrinkles.",
      basePrice: 1299.0,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { sku: "CR-MLS-7-NS", size: "7 ft (Window)", color: "Natural Sand", colorCode: "#C9BBA8", stock: 30, priceAdjustment: 0.0 },
        { sku: "CR-MLS-9-NS", size: "9 ft (Door)", color: "Natural Sand", colorCode: "#C9BBA8", stock: 25, priceAdjustment: 200.0 },
        { sku: "CR-MLS-7-IV", size: "7 ft (Window)", color: "Ivory Cream", colorCode: "#FBF6EE", stock: 30, priceAdjustment: 0.0 },
      ],
    },
    {
      name: "Thermal Blackout Curtain Panel",
      description: "Blocks out 99% of light and absorbs ambient sound. Features a heavy multi-layered canvas texture on the front and an eco-friendly acrylic backing. Essential for deep sleep and home theater setups.",
      category: "Curtains",
      fabric: "Triple-Woven Heavy Canvas",
      threadCount: undefined,
      gsm: 320,
      careInstructions: "Professional dry cleaning only. Iron on the fabric side only.",
      basePrice: 1899.0,
      isFeatured: false,
      images: [
        "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { sku: "CR-TBC-9-ES", size: "9 ft (Door)", color: "Espresso Brown", colorCode: "#3A2E28", stock: 15, priceAdjustment: 200.0 },
        { sku: "CR-TBC-7-ES", size: "7 ft (Window)", color: "Espresso Brown", colorCode: "#3A2E28", stock: 20, priceAdjustment: 0.0 },
      ],
    },

    // --- TABLE & KITCHEN LINEN ---
    {
      name: "Farmhouse Waffle Table Runner",
      description: "Featuring our deep-waffle weave with mitered corners and clean hem borders. Lends a rustic, organic warmth to dining settings, perfect for everyday family meals or festive parties.",
      category: "Table & Kitchen Linen",
      fabric: "100% Recycled Cotton Waffle",
      threadCount: undefined,
      gsm: 260,
      careInstructions: "Machine wash cold, iron while damp for a clean, pressed look.",
      basePrice: 799.0,
      isFeatured: false,
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { sku: "TL-FWR-72-NS", size: "14x72 inches (6 Seater)", color: "Natural Sand", colorCode: "#C9BBA8", stock: 25, priceAdjustment: 0.0 },
        { sku: "TL-FWR-90-NS", size: "14x90 inches (8 Seater)", color: "Natural Sand", colorCode: "#C9BBA8", stock: 20, priceAdjustment: 150.0 },
        { sku: "TL-FWR-72-GD", size: "14x72 inches (6 Seater)", color: "Gold Accent", colorCode: "#C9A24B", stock: 15, priceAdjustment: 100.0 },
      ],
    },
    {
      name: "Classic Checkered Napkins (Set of 6)",
      description: "Highly absorbent, lint-free checked dinner napkins. Perfect for wiping glasses, cleaning setups, or wrapping fresh breads. Essential utility with editorial style.",
      category: "Table & Kitchen Linen",
      fabric: "100% Long-Staple Cotton",
      threadCount: undefined,
      gsm: 200,
      careInstructions: "Hot wash safe, durable, tumble dry warm.",
      basePrice: 499.0,
      isFeatured: false,
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { sku: "TL-CCN-6-AR", size: "18x18 inches", color: "Alemah Red Check", colorCode: "#A63D3D", stock: 40, priceAdjustment: 0.0 },
        { sku: "TL-CCN-6-ES", size: "18x18 inches", color: "Espresso Check", colorCode: "#3A2E28", stock: 35, priceAdjustment: 0.0 },
      ],
    },
    {
      name: "Linen Weave Hostess Apron",
      description: "A professional-caliber cooking apron with adjustable neck loop straps and two wide front utility pockets. Styled in thick linen weave to prevent kitchen spills from penetrating.",
      category: "Table & Kitchen Linen",
      fabric: "Heavy Linen Weave Cotton",
      threadCount: undefined,
      gsm: 300,
      careInstructions: "Machine wash cold, dry flat. Do not dry clean.",
      basePrice: 899.0,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { sku: "TL-LHA-F-ES", size: "Free Size (Adjustable)", color: "Espresso", colorCode: "#3A2E28", stock: 20, priceAdjustment: 0.0 },
        { sku: "TL-LHA-F-AR", size: "Free Size (Adjustable)", color: "Alemah Red", colorCode: "#A63D3D", stock: 15, priceAdjustment: 50.0 },
      ],
    },
  ];

  for (const prod of productsData) {
    const createdProduct = await prisma.product.create({
      data: {
        name: prod.name,
        description: prod.description,
        category: prod.category,
        fabric: prod.fabric,
        threadCount: prod.threadCount,
        gsm: prod.gsm,
        careInstructions: prod.careInstructions,
        basePrice: prod.basePrice,
        isFeatured: prod.isFeatured,
        rating: 4.5 + Math.random() * 0.5, // 4.5 to 5.0 random ratings
        ratingCount: Math.floor(20 + Math.random() * 80),
      },
    });

    // Add images
    for (let i = 0; i < prod.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: prod.images[i],
          order: i,
        },
      });
    }

    // Add variants
    for (const v of prod.variants) {
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          sku: v.sku,
          size: v.size,
          color: v.color,
          colorCode: v.colorCode,
          stock: v.stock,
          priceAdjustment: v.priceAdjustment,
        },
      });
    }

    // Add 1-2 default reviews per product
    await prisma.review.create({
      data: {
        userId: demoUser.id,
        productId: createdProduct.id,
        rating: 5,
        comment: `Excellent product! The fabric is incredibly premium and heavy. It feels much more expensive than it is. Highly recommend Alemah!`,
      },
    });
  }

  console.log("Database seeded successfully with 15 products!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
