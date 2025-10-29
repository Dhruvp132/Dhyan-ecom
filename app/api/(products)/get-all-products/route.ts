import { prismaDB } from "@/db/db.config";
// import { client } from "@/lib/Redis";
import { NextResponse } from "next/server";

/* Redis temporarily disabled
async function getProductsFromCache() {
  const cache = await client.get("products");
  return cache ? JSON.parse(cache) : null;
}

async function fetchProductsAndUpdateCache() {
  const products = await prismaDB.product.findMany({
    include: {
      categories: true,
    },
  });

  if (products.length > 0) {
    await client.set("products", JSON.stringify(products), "EX", 120);
  }

  return products;
}
*/

export const GET = async () => {
  try {
    // Redis temporarily disabled - fetching directly from database
    // let products = await getProductsFromCache();
    // if (!products) {
    //   products = await fetchProductsAndUpdateCache();
    // }

    const raw = await prismaDB.product.findMany({
      include: {
        categories: true,
      },
    });

    // Normalize response to ensure arrays are always string[]
    const toStringArray = (val: any): string[] => {
      if (Array.isArray(val)) return val.map((v) => (typeof v === 'string' ? v.trim() : '')).filter(Boolean)
      if (typeof val === 'string') return val.split(/[\n,]+/).map((v) => v.trim()).filter(Boolean)
      return []
    }

    const products = raw.map((p) => ({
      ...p,
      otherImages: toStringArray((p as any).otherImages),
      sizes: toStringArray((p as any).sizes),
      colors: toStringArray((p as any).colors),
      // categories already included as objects; keep as-is
    }))

    if (products.length === 0) {
      return NextResponse.json(
        { message: "No products found" },
        { status: 404 }
      );
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the products." },
      { status: 500 }
    );
  }
};
