/**
 * Migration script to handle the transition from old order structure to new
 * 
 * This script will:
 * 1. Delete all existing orders (since they're incompatible with new structure)
 * 2. This allows the new schema to be applied
 * 
 * Run with: npx tsx scripts/migrate-orders.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting order migration...\n');

  try {
    // Count existing orders
    const orderCount = await prisma.order.count();
    console.log(`Found ${orderCount} existing orders`);

    if (orderCount > 0) {
      console.log('⚠️  WARNING: This will delete all existing orders!');
      console.log('The old order structure is incompatible with the new one.');
      console.log('\nDeleting old orders...');
      
      // Delete all orders
      const deleted = await prisma.order.deleteMany({});
      console.log(`✓ Deleted ${deleted.count} orders`);
    } else {
      console.log('No existing orders found. Safe to proceed.');
    }

    // Also clean up order addresses that might be orphaned
    console.log('\nCleaning up order addresses...');
    const addressCount = await prisma.orderAddress.count();
    if (addressCount > 0) {
      const deletedAddresses = await prisma.orderAddress.deleteMany({});
      console.log(`✓ Deleted ${deletedAddresses.count} order addresses`);
    }

    console.log('\n✅ Migration preparation complete!');
    console.log('\nNext steps:');
    console.log('1. Run: npx prisma db push');
    console.log('2. Run: npx prisma generate');
    console.log('3. Start your dev server: npm run dev');

  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
