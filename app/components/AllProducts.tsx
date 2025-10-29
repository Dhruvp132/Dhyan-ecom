"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import ProductCard from "@/app/components/ProductCard";
import { useGetAllProductsQuery } from "@/providers/toolkit/features/GetAllProductsSlice";
import ProductsSkeletons from "@/app/temp/ProductsSkeletons";
import { useAppDispatch, useAppSelector } from "@/providers/toolkit/hooks/hooks";
import { GetProductsByCategory } from "@/providers/toolkit/features/GetProductsByCategorySlice";
import { FilterDropdown } from "./FilterDropdown";
import { SortDropdown } from "./SortDropdown";
import { motion } from "framer-motion";

type Product = {
  id: string | number;
  name: string;
  price: number;
  mainImage: string;
  otherImages: string | string[];
  originalPrice?: number;
  isOnSale?: boolean;
};

const AllProduct = ({ cat }: { cat?: { cate: string } }) => {
  const [sortOption, setSortOption] = useState<string>("featured");
  const [loadedCount, setLoadedCount] = useState(0);
  const [priceFilter, setPriceFilter] = useState({ from: "", to: "" });
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const dispatch = useAppDispatch();
  const productData = useAppSelector((state) => state.category);
  const { data, error, isLoading } = useGetAllProductsQuery();

  // Define filter categories
  const filterCategories = [
    {
      id: "size",
      label: "Size",
      options: [
        { id: "xs", label: "XS", count: 45 },
        { id: "s", label: "S", count: 52 },
        { id: "m", label: "M", count: 68 },
        { id: "l", label: "L", count: 73 },
        { id: "xl", label: "XL", count: 42 },
        { id: "xxl", label: "XXL", count: 28 },
      ],
    },
    {
      id: "availability",
      label: "Availability",
      options: [
        { id: "in-stock", label: "In stock", count: 180 },
        { id: "out-of-stock", label: "Out of stock", count: 0 },
      ],
    },
    {
      id: "price",
      label: "Price",
      options: [
        { id: "under-500", label: "Under ₹500", count: 42 },
        { id: "500-1000", label: "₹500 - ₹1000", count: 68 },
        { id: "1000-2000", label: "₹1000 - ₹2000", count: 55 },
        { id: "over-2000", label: "Over ₹2000", count: 23 },
      ],
    },
  ];

  const sortOptionsData = [
    { label: "Featured", value: "featured" },
    { label: "Price: Low to High", value: "price-low" },
    { label: "Price: High to Low", value: "price-high" },
    { label: "Newest", value: "newest" },
  ];

  useEffect(() => {
    if (cat?.cate) {
      dispatch(GetProductsByCategory(cat.cate));
    }
  }, [cat, dispatch]);

  const handleImageLoad = useCallback(() => {
    setLoadedCount((prev) => prev + 1);
  }, []);

  const handleApplyFilters = (filters: Record<string, string[]>) => {
    setSelectedFilters(filters);
    
    // Handle price filter
    if (filters.price && filters.price.length > 0) {
      const priceRanges = filters.price;
      let minPrice = 0;
      let maxPrice = Infinity;
      
      priceRanges.forEach((range) => {
        if (range === "under-500") {
          maxPrice = Math.min(maxPrice, 500);
        } else if (range === "500-1000") {
          minPrice = Math.max(minPrice, 500);
          maxPrice = Math.min(maxPrice, 1000);
        } else if (range === "1000-2000") {
          minPrice = Math.max(minPrice, 1000);
          maxPrice = Math.min(maxPrice, 2000);
        } else if (range === "over-2000") {
          minPrice = Math.max(minPrice, 2000);
        }
      });
      
      setPriceFilter({ from: minPrice.toString(), to: maxPrice === Infinity ? "" : maxPrice.toString() });
    } else {
      setPriceFilter({ from: "", to: "" });
    }
  };

  const handleFilter = (filterData: any) => {
    if (filterData.type === "price") {
      setPriceFilter(filterData.filters);
    }
  };

  const sortedAndFilteredProducts = useMemo(() => {
    let products = cat?.cate ? productData.products : data || [];

    // Apply availability filter
    if (selectedFilters.availability && selectedFilters.availability.length > 0) {
      // Add your availability logic here based on your product data structure
      // For now, we'll keep all products as in-stock
    }

    // Apply size filter
    if (selectedFilters.size && selectedFilters.size.length > 0) {
      // Add your size filter logic here based on your product data structure
      // This would require a size field in your product data
    }

    // Apply price filter
    if (priceFilter.from || priceFilter.to) {
      products = products.filter((product) => {
        const price = product.price;
        const from = priceFilter.from ? parseFloat(priceFilter.from) : 0;
        const to = priceFilter.to ? parseFloat(priceFilter.to) : Infinity;
        return price >= from && price <= to;
      });
    }

    const sorted = [...products].sort((a, b) => {
      switch (sortOption) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return Number(b.id) - Number(a.id);
        case "featured":
        default:
          return 0;
      }
    });

    return sorted;
  }, [cat, productData.products, data, sortOption, priceFilter, selectedFilters]);

  // Calculate delay based on column position - faster delays
  const getColumnDelay = (index: number) => {
    const columns = {
      mobile: 2,
      tablet: 3,
      desktop: 4,
    };

    const columnIndex = index % columns.desktop;
    const rowIndex = Math.floor(index / columns.desktop);

    // Reduced delays for faster animation
    return rowIndex * 0.2 + columnIndex * 0.05;
  };

  if (isLoading) {
    return <ProductsSkeletons />;
  }

  return (
    <section className="w-full py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {cat?.cate ? `Products in ${cat.cate}` : "All Products"}
          </h2>
        </div>

        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <FilterDropdown 
            categories={filterCategories} 
            sortOptions={sortOptionsData}
            onApply={handleApplyFilters}
            onSort={setSortOption}
          />

          <div className="hidden lg:flex items-center gap-4">
            <span className="text-sm text-gray-700">Sort by:</span>
            <SortDropdown
              options={[
                { label: "Featured", value: "featured" },
                { label: "Price: Low to High", value: "price-low" },
                { label: "Price: High to Low", value: "price-high" },
                { label: "Newest", value: "newest" },
              ]}
              defaultValue="featured"
              onSort={setSortOption}
            />
            <span className="text-sm text-gray-700">{sortedAndFilteredProducts.length} products</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {error ? (
            <div>Error loading products.</div>
          ) : sortedAndFilteredProducts.length === 0 ? (
            <div>No products found.</div>
          ) : (
            sortedAndFilteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.4,
                  delay: getColumnDelay(index),
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <ProductCard product={product as Product} onLoad={handleImageLoad} />
              </motion.div>
            ))
          )}
        </div>

        {loadedCount < sortedAndFilteredProducts.length && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Loading products... ({loadedCount}/{sortedAndFilteredProducts.length})
          </div>
        )}
      </div>
    </section>
  );
};

export default AllProduct;
