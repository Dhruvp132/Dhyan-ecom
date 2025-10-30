import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

const dummyProducts = [
  {
    name: "Premium Black T-Shirt",
    description: "Ultra-soft premium cotton t-shirt with a modern fit. Perfect for casual everyday wear or layering. Features reinforced stitching and pre-shrunk fabric.",
    price: 799,
    mainImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop",
    otherImages: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1520975922284-2aa7f1a3363a?w=800&h=800&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Gray", "Navy"],
    tags: ["t-shirt", "black", "cotton", "casual", "basics"],
    quantity: 100,
    category: "man"
  },
  {
    name: "Slim Fit Denim Jeans",
    description: "Classic slim-fit jeans crafted from premium stretch denim. Comfortable 5-pocket design with a modern tapered leg. Perfect blend of style and comfort.",
    price: 1899,
    mainImage: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop",
    otherImages: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&h=800&fit=crop"
    ],
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: ["Blue", "Black", "Gray"],
    tags: ["jeans", "denim", "slim-fit", "casual", "pants"],
    quantity: 75,
    category: "man"
  },
  {
    name: "Floral Summer Dress",
    description: "Elegant floral print maxi dress perfect for summer events. Lightweight breathable fabric with a flattering A-line silhouette. Features adjustable straps and side pockets.",
    price: 2299,
    mainImage: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=800&fit=crop",
    otherImages: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=800&fit=crop"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Floral Blue", "Floral Pink", "Floral Yellow"],
    tags: ["dress", "floral", "summer", "maxi", "elegant"],
    quantity: 60,
    category: "woman"
  },
  {
    name: "Kids Cotton Hoodie",
    description: "Cozy pullover hoodie with fun graphic prints. Made from soft cotton blend fabric. Features kangaroo pocket and adjustable drawstring hood.",
    price: 1099,
    mainImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop",
    otherImages: [
      "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800&h=800&fit=crop"
    ],
    sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    colors: ["Red", "Blue", "Green", "Black"],
    tags: ["hoodie", "kids", "cotton", "graphic", "casual"],
    quantity: 90,
    category: "children"
  },
  {
    name: "Classic Polo Shirt",
    description: "Timeless polo shirt in premium pique cotton. Features classic collar with 3-button placket. Perfect for smart-casual occasions.",
    price: 999,
    mainImage: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&h=800&fit=crop",
    otherImages: [
      "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&h=800&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Navy", "Green", "Red"],
    tags: ["polo", "shirt", "casual", "smart-casual", "cotton"],
    quantity: 120,
    category: "man"
  },
  {
    name: "Women's Tailored Blazer",
    description: "Professional tailored blazer perfect for office wear. Features notched lapels, single-button closure, and functional pockets. Made from premium wool blend.",
    price: 3499,
    mainImage: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&h=800&fit=crop",
    otherImages: [
      "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=800&fit=crop"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Gray"],
    tags: ["blazer", "formal", "office", "professional", "tailored"],
    quantity: 45,
    category: "woman"
  },
  {
    name: "Kids Cargo Shorts",
    description: "Durable cargo shorts perfect for active kids. Features multiple pockets and adjustable waist. Made from quick-dry breathable fabric.",
    price: 699,
    mainImage: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=800&fit=crop",
    otherImages: [
      "https://images.unsplash.com/photo-1598032895397-b9c7d18eeaea?w=800&h=800&fit=crop"
    ],
    sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y"],
    colors: ["Khaki", "Navy", "Olive", "Gray"],
    tags: ["shorts", "cargo", "kids", "summer", "casual"],
    quantity: 85,
    category: "children"
  },
  {
    name: "Formal Dress Shirt",
    description: "Crisp formal dress shirt with classic fit. Made from easy-care cotton blend. Features button-down collar and chest pocket.",
    price: 1499,
    mainImage: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=800&fit=crop",
    otherImages: [
      "https://images.unsplash.com/photo-1598032895397-b9c7d18eeaea?w=800&h=800&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Light Blue", "Pink"],
    tags: ["shirt", "formal", "dress", "business", "office"],
    quantity: 95,
    category: "man"
  },
  {
    name: "Leather Crossbody Bag",
    description: "Elegant genuine leather crossbody bag with adjustable strap. Features multiple compartments and zip closure. Perfect for everyday use.",
    price: 2899,
    mainImage: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=800&fit=crop",
    otherImages: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop"
    ],
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Tan"],
    tags: ["bag", "crossbody", "leather", "accessories", "women"],
    quantity: 50,
    category: "accessories"
  },
  {
    name: "Running Sneakers",
    description: "Lightweight running sneakers with cushioned sole and breathable mesh upper. Perfect for jogging, gym, or casual wear.",
    price: 2499,
    mainImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
    otherImages: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop"
    ],
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    colors: ["Black", "White", "Blue", "Red"],
    tags: ["shoes", "sneakers", "running", "sports", "footwear"],
    quantity: 80,
    category: "accessories"
  },
  {
    name: "Knit Sweater",
    description: "Cozy knit sweater perfect for cooler weather. Features crew neck and ribbed trim. Made from soft acrylic blend.",
    price: 1799,
    mainImage: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop",
    otherImages: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=800&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Gray", "Navy", "Burgundy", "Beige"],
    tags: ["sweater", "knitwear", "winter", "warm", "casual"],
    quantity: 70,
    category: "man"
  },
  {
    name: "Yoga Leggings",
    description: "High-waisted yoga leggings with 4-way stretch. Moisture-wicking fabric with hidden pocket. Perfect for yoga, gym, or casual wear.",
    price: 1299,
    mainImage: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&h=800&fit=crop",
    otherImages: [
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&h=800&fit=crop"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Purple", "Teal"],
    tags: ["leggings", "yoga", "activewear", "fitness", "women"],
    quantity: 110,
    category: "woman"
  }
];

const searchSuggestions = [
  { term: "t-shirt", popularity: 120 },
  { term: "jeans", popularity: 110 },
  { term: "dress", popularity: 100 },
  { term: "hoodie", popularity: 95 },
  { term: "shirt", popularity: 90 },
  { term: "blazer", popularity: 85 },
  { term: "shorts", popularity: 80 },
  { term: "sneakers", popularity: 75 },
  { term: "bag", popularity: 70 },
  { term: "sweater", popularity: 65 },
  { term: "leggings", popularity: 60 },
  { term: "black t-shirt", popularity: 55 },
  { term: "white shirt", popularity: 50 },
  { term: "blue jeans", popularity: 45 },
  { term: "summer dress", popularity: 40 },
  { term: "kids clothes", popularity: 35 },
  { term: "formal wear", popularity: 30 },
  { term: "casual wear", popularity: 25 },
  { term: "activewear", popularity: 20 },
  { term: "accessories", popularity: 15 },
];

async function main() {
  console.log('🌱 Starting fresh seed...');

  // ============================================
  // STEP 1: Clean existing data
  // ============================================
  console.log('🧹 Cleaning existing data...');
  
  try {
    await prisma.orderItem.deleteMany({});
    console.log('  ✓ Deleted all order items');
  } catch (e) {
    console.log('  ⚠ No order items to delete');
  }

  try {
    await prisma.order.deleteMany({});
    console.log('  ✓ Deleted all orders');
  } catch (e) {
    console.log('  ⚠ No orders to delete');
  }

  try {
    await prisma.orderAddress.deleteMany({});
    console.log('  ✓ Deleted all order addresses');
  } catch (e) {
    console.log('  ⚠ No order addresses to delete');
  }

  try {
    await prisma.cart.deleteMany({});
    console.log('  ✓ Deleted all cart items');
  } catch (e) {
    console.log('  ⚠ No cart items to delete');
  }

  try {
    await prisma.category.deleteMany({});
    console.log('  ✓ Deleted all categories');
  } catch (e) {
    console.log('  ⚠ No categories to delete');
  }

  try {
    await prisma.product.deleteMany({});
    console.log('  ✓ Deleted all products');
  } catch (e) {
    console.log('  ⚠ No products to delete');
  }

  try {
    await prisma.searchSuggestion.deleteMany({});
    console.log('  ✓ Deleted all search suggestions');
  } catch (e) {
    console.log('  ⚠ No search suggestions to delete');
  }

  try {
    await prisma.user.deleteMany({});
    console.log('  ✓ Deleted all users');
  } catch (e) {
    console.log('  ⚠ No users to delete');
  }

  console.log('');

  // ============================================
  // STEP 2: Create admin user
  // ============================================
  console.log('👤 Creating admin user...');
  const hashedPassword = await bcryptjs.hash('Admin@123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@shop-smart.com',
      name: 'Admin User',
      password: hashedPassword,
      isAdmin: true,
    },
  });

  console.log(`  ✓ Created admin user: ${adminUser.email}`);
  console.log('');

  // ============================================
  // STEP 3: Create products with proper types
  // ============================================
  console.log('📦 Creating products...');
  for (const product of dummyProducts) {
    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        mainImage: product.mainImage,
        otherImages: product.otherImages,
        sizes: product.sizes,
        colors: product.colors,
        tags: product.tags,
        quantity: product.quantity,
        userId: adminUser.id,
        categories: {
          create: {
            name: product.category,
          },
        },
      },
    });
    console.log(`  ✓ Created: ${createdProduct.name}`);
  }
  console.log('');

  // ============================================
  // STEP 4: Create search suggestions
  // ============================================
  console.log('🔍 Creating search suggestions...');
  for (const suggestion of searchSuggestions) {
    await prisma.searchSuggestion.create({
      data: suggestion,
    });
    console.log(`  ✓ Created suggestion: ${suggestion.term}`);
  }
  console.log('');

  console.log('✅ Seeding completed successfully!');
  console.log('');
  console.log('📝 Summary:');
  console.log(`   - Admin User: admin@shop-smart.com (password: admin123)`);
  console.log(`   - Products: ${dummyProducts.length}`);
  console.log(`   - Search Suggestions: ${searchSuggestions.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

