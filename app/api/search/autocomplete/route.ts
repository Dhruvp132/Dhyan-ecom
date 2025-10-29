export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prismaDB } from "@/db/db.config";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [], products: [] });
    }

    // Get search suggestions (popular search terms)
    const suggestions = await prismaDB.searchSuggestion.findMany({
      where: {
        term: {
          contains: query,
          mode: "insensitive",
        },
      },
      orderBy: { popularity: "desc" },
      take: 5,
    });

    // Get matching products (limited for autocomplete)
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
      select: {
        id: true,
        name: true,
        mainImage: true,
        price: true,
        colors: true,
        sizes: true,
      },
      take: 4,
    });

    // Also get category suggestions
    const categories = await prismaDB.category.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        name: true,
      },
      distinct: ["name"],
      take: 3,
    });

    const categorySuggestions = categories.map((c: any) => c.name);
    const termSuggestions = suggestions.map((s: any) => s.term);

    // Combine and deduplicate suggestions
    const allSuggestions = Array.from(
      new Set([...termSuggestions, ...categorySuggestions])
    );

    return NextResponse.json({
      suggestions: allSuggestions,
      products,
    });
  } catch (error) {
    console.error("Autocomplete search error:", error);
    return NextResponse.json(
      { suggestions: [], products: [], error: "Search failed" },
      { status: 500 }
    );
  }
}
