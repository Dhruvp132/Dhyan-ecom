"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";

type Product = {
  id: number | string;
  name: string;
  price: number;
  mainImage: string;
  otherImages: string | string[];
  originalPrice?: number;
  isOnSale?: boolean;
};

const ProductCard = ({ product, onLoad }: { product: Product; onLoad?: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hoverImageLoaded, setHoverImageLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const hoverImage = product.otherImages 
    ? (Array.isArray(product.otherImages) ? product.otherImages[0] : product.otherImages) 
    : product.mainImage;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Link href={`/products/${product.id}`}>
      <div ref={ref} className="group flex flex-col">
        <div className="relative mb-4 overflow-hidden aspect-[4/5] rounded-lg">
          {isVisible && (
            <>
              <Image
                src={product.mainImage}
                alt={product.name}
                fill
                className={`object-cover transition-all duration-500 ease-out ${
                  imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                } group-hover:opacity-0 group-hover:scale-105`}
                onLoadingComplete={() => {
                  setImageLoaded(true);
                  onLoad?.();
                }}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              <Image
                src={hoverImage}
                alt={`${product.name} alternate view`}
                fill
                className={`object-cover absolute top-0 left-0 transition-all duration-500 ease-out opacity-0 scale-110 group-hover:opacity-100 group-hover:scale-100 ${
                  hoverImageLoaded ? "" : "blur-sm"
                }`}
                onLoadingComplete={() => setHoverImageLoaded(true)}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                loading="lazy"
              />

              {product.isOnSale && (
                <div className="absolute bottom-3 left-3 bg-black text-white px-3 py-1 text-xs font-medium rounded-full z-10 transition-transform duration-200 ease-out group-hover:scale-110">
                  Sale
                </div>
              )}

              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
              )}
            </>
          )}
        </div>

        <div className="flex flex-col gap-1 transition-all duration-200 ease-out group-hover:translate-y-[-2px]">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1 transition-colors duration-200 ease-out group-hover:text-gray-600">
            {product.name}
          </h3>

          <div className="flex flex-col gap-0.5">
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through transition-colors duration-200 ease-out">
                ₹{product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-sm font-semibold text-gray-900 transition-colors duration-200 ease-out group-hover:text-blue-600 mb-[20px] md:mb-[25px] lg:mb-[25px]">
              ₹{product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
