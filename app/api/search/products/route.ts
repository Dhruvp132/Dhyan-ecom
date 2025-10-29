export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prismaDB } from "@/db/db.config";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "24");

    if (!query) {
      return NextResponse.json({ products: [], total: 0 });
    }

    // Track search term for suggestions
    try {
      await prismaDB.searchSuggestion.upsert({
        where: { term: query.toLowerCase() },
        update: {
          popularity: {
            increment: 1,
          },
        },
        create: {
          term: query.toLowerCase(),
          popularity: 1,
        },
      });
    } catch (err) {
      // Silent fail for search tracking
      console.log("Search tracking error:", err);
    }

    // Search for products
    const products = await prismaDB.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        categories: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get total count for pagination
    const total = await prismaDB.product.count({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Product search error:", error);
    return NextResponse.json(
      { products: [], total: 0, error: "Search failed" },
      { status: 500 }
    );
  }
}
