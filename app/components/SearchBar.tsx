"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  mainImage: string;
  price: number;
  colors: string[];
  sizes: string[];
}

interface SearchBarProps {
  className?: string;
}

const searchTransition = {
  duration: 0.28,
  ease: [0.4, 0, 0.2, 1] as const,
};

export function SearchBar({ className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced API calls to avoid excessive requests
  const debouncedSearch = useDebouncedCallback(async (searchTerm: string) => {
    if (searchTerm.length > 1) {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search/autocomplete?q=${encodeURIComponent(searchTerm)}`
        );
        const data = await response.json();
        setSuggestions(data.suggestions || []);
        setProducts(data.products || []);
        setShowDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setShowDropdown(false);
      setSuggestions([]);
      setProducts([]);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowDropdown(false);
      setQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setShowDropdown(false);
    setSuggestions([]);
    setProducts([]);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          size={20}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.length > 1) {
              setShowDropdown(true);
            }
          }}
          placeholder="Search products..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#2F5A8A] transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && query.length > 1 && (
          <motion.div
            key="search-dropdown"
            ref={dropdownRef}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={searchTransition}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-[0_20px_45px_rgba(35,68,108,0.12)] max-h-[500px] overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-pulse">Searching...</div>
              </div>
            ) : (
              <>
                {/* Suggestions Section */}
                {suggestions.length > 0 && (
                  <div className="p-3 border-b border-gray-100">
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">
                      Suggestions
                    </h3>
                    <div className="space-y-1">
                      {suggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.03 }}
                          className="px-3 py-2 hover:bg-gray-50 cursor-pointer rounded text-sm transition-colors"
                          onClick={() => handleSearch(suggestion)}
                        >
                          <Search size={14} className="inline mr-2 text-gray-400" />
                          {suggestion}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products Section */}
                {products.length > 0 && (
                  <div className="p-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">
                      Products
                    </h3>
                    <div className="space-y-2">
                      {products.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.03 }}
                          className="flex items-center px-2 py-2 hover:bg-gray-50 cursor-pointer rounded transition-colors"
                          onClick={() => {
                            router.push(`/products/${product.id}`);
                            setShowDropdown(false);
                            setQuery("");
                          }}
                        >
                          <div className="relative w-14 h-14 mr-3 flex-shrink-0 bg-background rounded">
                            <Image
                              src={product.mainImage}
                              alt={product.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-600">₹{product.price}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    {products.length === 4 && (
                      <button
                        onClick={() => handleSearch(query)}
                        className="w-full mt-2 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 rounded transition-colors"
                      >
                        View all results for &quot;{query}&quot;
                      </button>
                    )}
                  </div>
                )}

                {/* No Results */}
                {!isLoading && suggestions.length === 0 && products.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    <p className="text-sm">No results found for &quot;{query}&quot;</p>
                    <button
                      onClick={() => handleSearch(query)}
                      className="mt-2 text-sm text-gray-900 hover:underline"
                    >
                      Search anyway
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
