"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import ProductCard from "@/app/components/ProductCard";
import { Search } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  mainImage: string;
  otherImages: string[];
  colors: string[];
  sizes: string[];
  categories: {
    id: string;
    name: string;
  }[];
}

interface SearchResults {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setSearchResults(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search/products?q=${encodeURIComponent(query)}&page=${currentPage}`
        );
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, currentPage]);

  if (!query) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Search size={64} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Start Searching
          </h2>
          <p className="text-gray-500">
            Enter a search term to find products
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 w-64 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="flex flex-col">
                <div className="aspect-[4/5] bg-gray-200 animate-pulse rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Search Results for &quot;{query}&quot;
          </h1>
          <p className="text-gray-600">
            {searchResults?.total || 0} {searchResults?.total === 1 ? "product" : "products"} found
          </p>
        </div>

        {/* Products Grid */}
        {searchResults && searchResults.products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {searchResults.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    mainImage: product.mainImage,
                    otherImages: product.otherImages,
                  }}
                />
              ))}
            </div>

            {/* Pagination */}
            {searchResults.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {searchResults.totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, searchResults.totalPages)
                    )
                  }
                  disabled={currentPage === searchResults.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Search size={64} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No products found
            </h2>
            <p className="text-gray-500 mb-6">
              We couldn&apos;t find any products matching &quot;{query}&quot;
            </p>
            <p className="text-sm text-gray-400">
              Try searching with different keywords or browse our categories
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
