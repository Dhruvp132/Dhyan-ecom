"use client";
import { useEffect, useState, useCallback } from "react";
import { useGetAllProductsQuery } from "@/providers/toolkit/features/GetAllProductsSlice";
import ProductCard from "./ProductCard";
import ProductsSkeletons from "../temp/ProductsSkeletons";
import { motion } from "framer-motion";

type Product = {
  id: number | string;
  name: string;
  price: number;
  mainImage: string;
  otherImages: string | string[];
  originalPrice?: number;
  isOnSale?: boolean;
};

const HomeProducts = () => {
  const { data, error, isLoading } = useGetAllProductsQuery();
  const [randomProducts, setRandomProducts] = useState<Product[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    if (data) {
      const shuffledData = shuffleArray([...data]);
      const selectedData = shuffledData.slice(0, 8);
      setRandomProducts(selectedData);
    }
  }, [data]);

  const handleImageLoad = useCallback(() => {
    setLoadedCount((prev) => prev + 1);
  }, []);

  function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

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

  if (isLoading) return <ProductsSkeletons />;
  if (error)
    return (
      <h1 className="text-2xl font-bold text-center text-red-500">
        Error: Failed to load products
      </h1>
    );

  return (
    <div className="w-full px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {randomProducts.length > 0 ? (
            randomProducts.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.4,
                  delay: getColumnDelay(index),
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <ProductCard product={product} onLoad={handleImageLoad} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full">
              <h1 className="text-2xl font-bold text-center text-gray-400">
                No products found
              </h1>
            </div>
          )}
        </div>
        {loadedCount < randomProducts.length && randomProducts.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Loading products... ({loadedCount}/{randomProducts.length})
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeProducts;
