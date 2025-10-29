import { prismaDB } from "@/db/db.config";
// import { client } from "@/lib/Redis";
import { NextResponse } from "next/server";

export const GET = async (_: any, { params }: { params: { id: string } }) => {
  try {
    // Redis temporarily disabled
    // const cachedProduct = await client.get(`product:${params.id}`);
    // let product;

    // if (cachedProduct) {
    //   product = JSON.parse(cachedProduct);
    // } else {
    const raw = await prismaDB.product.findUnique({
      where: {
        id: params?.id,
      },
      include: {
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    const toStringArray = (val: any): string[] => {
      if (Array.isArray(val)) return val.map((v) => (typeof v === 'string' ? v.trim() : '')).filter(Boolean)
      if (typeof val === 'string') return val.split(/[\n,]+/).map((v) => v.trim()).filter(Boolean)
      return []
    }
    const product = raw && {
      ...raw,
      otherImages: toStringArray((raw as any).otherImages),
      sizes: toStringArray((raw as any).sizes),
      colors: toStringArray((raw as any).colors),
    }

    //   if (product) {
    //     await client.setex(
    //       `product:${params.id}`,
    //       120,
    //       JSON.stringify(product)
    //     );
    //   }
    // }

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

  return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the product." },
      { status: 500 }
    );
  }
};
