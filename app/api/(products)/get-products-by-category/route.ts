import { prismaDB } from "@/db/db.config";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { category } = await req.json();

    const raw = await prismaDB.product.findMany({
      where: {
        categories: {
          some: {
            name: {
              equals: category,
            },
          },
        },
      },
      include: {
        categories: { select: { name: true } },
      },
    });

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
    }))

    if (!products.length) {
      return NextResponse.json({ error: "No products found" }, { status: 404 });
    }
  return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    );
  }
};
