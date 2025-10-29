import { prismaDB } from "@/db/db.config";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    let missingFields: any = [];

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message: `Please fill all the fields. Missing fields: ${missingFields.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Helpers to normalize inputs
    const toStringArray = (val: unknown): string[] => {
      if (Array.isArray(val)) {
        return val
          .map((v) => (typeof v === 'string' ? v.trim() : ''))
          .filter(Boolean)
      }
      if (typeof val === 'string') {
        // Split on commas or newlines, trim and filter empties
        return val
          .split(/[\n,]+/)
          .map((v) => v.trim())
          .filter(Boolean)
      }
      return []
    }

    const normalizeCategories = (val: unknown): { create: { name: string }[] } => {
      if (Array.isArray(val)) {
        // Accept either array of strings or array of { name }
        const items = (val as any[]).map((c) =>
          typeof c === 'string' ? { name: c.trim() } : { name: c?.name?.toString()?.trim() || '' }
        ).filter((c) => c.name)
        return { create: items }
      }
      if (typeof val === 'string') {
        const items = toStringArray(val).map((name) => ({ name }))
        return { create: items }
      }
      return { create: [] }
    }

    // Ensure arrays are properly normalized
    const productData = {
      name: body.name,
      description: body.description,
      price: body.price,
      mainImage: Array.isArray(body.mainImage) ? body.mainImage[0] : body.mainImage,
      quantity: body.quantity,
      sizes: toStringArray(body.sizes),
      colors: toStringArray(body.colors),
      tags: toStringArray(body.tags),
      otherImages: toStringArray(body.otherImages),
      userId: body.userId,
      categories: normalizeCategories(body.categories),
    } as const;

    const product = await prismaDB.product.create({
      data: productData,
    });

    return NextResponse.json(
      { product, message: "Product created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error", error: error },
      { status: 500 }
    );
  }
};
