"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import SingleProductSkeleton from "@/app/temp/SingleProductSkeleton";
import { useGetProductByIdQuery } from "@/providers/toolkit/features/GetAllProductsSlice";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/providers/toolkit/hooks/hooks";
import { AddToCart } from "@/providers/toolkit/features/AddToCartSlice";
import ProductHero from "./product-hero";
import ImageSidebar from "./image-sidebar";
import StickyImageStack from "./sticky-image-stack";
import MainImageDisplay from "./main-image-display";
import ProductDetails from "./product-details";
import ReviewsSection from "./reviews-section";
import RelatedProducts from "./related-products";

interface SessionUser {
  id: string;
}

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetProductByIdQuery(id);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageStacking, setIsImageStacking] = useState(false);
  const [stackProgress, setStackProgress] = useState(0);
  const [navHeight, setNavHeight] = useState<number>(64);
  const introSectionRef = useRef<HTMLDivElement>(null);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // Keep a stable viewport height to avoid iOS address bar causing layout jumps during animations
  const viewportHeightRef = useRef<number>(0);
  const isScrollingToImage = useRef(false);
  const { data: session } = useSession();
  const { push } = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  // Compute scroll-driven progress using a stable viewport height (avoids iOS URL bar jitter)
  useEffect(() => {
    const computeVH = () => {
      const vh = (window as any).visualViewport?.height ?? window.innerHeight;
      viewportHeightRef.current = Math.max(1, Math.floor(vh));
    };
    computeVH();

    const handleResize = () => computeVH();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    const handleScroll = () => {
      if (!introSectionRef.current) return;
      const el = introSectionRef.current;
      const rect = el.getBoundingClientRect();
      const vh = viewportHeightRef.current || window.innerHeight;
      const total = el.offsetHeight - vh;
      const normalized = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
      setStackProgress(normalized);
      setIsImageStacking(normalized > 0 && normalized < 1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  // Measure sticky navbar height
  useEffect(() => {
    const selector = "div.sticky.top-0";
    const navEl = document.querySelector(selector) as HTMLDivElement | null;
    const measure = () => {
      const h = navEl?.getBoundingClientRect().height || 64;
      setNavHeight((prev) => (Math.abs(prev - h) > 0.5 ? h : prev));
    };
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    let ro: ResizeObserver | null = null;
    if (navEl && "ResizeObserver" in window) {
      ro = new ResizeObserver(() => measure());
      ro.observe(navEl);
    }
    return () => {
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, []);

  const handleStackingStateChange = (isStacking: boolean, progress: number) => {
    setIsImageStacking(isStacking);
    setStackProgress(progress);
  };

  const handleImageSelect = (index: number) => {
    setActiveImageIndex(index);
    if (!introSectionRef.current || !data) return;
    // Skip programmatic scroll on mobile (< lg)
    if (typeof window !== "undefined" && !window.matchMedia("(min-width: 1024px)").matches) {
      return;
    }
    const imagesArr = [data.mainImage, ...(Array.isArray(data.otherImages) ? data.otherImages : [])];
    if (imagesArr.length <= 1) return;

    const el = introSectionRef.current;
    const vh = viewportHeightRef.current || window.innerHeight;
    const total = el.offsetHeight - vh;
    const targetProgress = index / imagesArr.length;

    const currentScrollTop = window.pageYOffset;
    const sectionTop = el.getBoundingClientRect().top + currentScrollTop;
    const targetScrollTop = sectionTop + targetProgress * total;

    if (isScrollingToImage.current) return;
    isScrollingToImage.current = true;
    const startTime = performance.now();
    const startScroll = currentScrollTop;
    const scrollDistance = targetScrollTop - startScroll;
    const duration = Math.min(1200, Math.abs(scrollDistance) * 0.5);
    const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(p);
      window.scrollTo(0, startScroll + scrollDistance * eased);
      if (p < 1) requestAnimationFrame(animate);
      else isScrollingToImage.current = false;
    };
    requestAnimationFrame(animate);
  };

  const handleAddToCart = (color: string, size: string, quantity: number) => {
    setIsAddingToCart(true);
    if (!session?.user) {
      toast({
        title: "Please login to add to cart",
        description: "You need to be logged in to add items to your cart",
        variant: "default",
        duration: 1500,
        style: {
          backgroundColor: "#191919",
          color: "#fff",
        },
      });
      setIsAddingToCart(false);
      return push("/login");
    } else {
      const userId = (session.user as SessionUser).id;
      dispatch(
        AddToCart({
          userId: userId,
          productId: id,
          quantity,
          color: color || data?.colors?.[0],
          size: size || data?.sizes?.[0],
        })
      ).finally(() => {
        setIsAddingToCart(false);
      });
    }
  };

  const handleBuyNow = () => {
    if (!session?.user) {
      toast({
        title: "Please login to continue",
        description: "You need to be logged in to make a purchase",
        variant: "default",
        duration: 1500,
        style: {
          backgroundColor: "#191919",
          color: "#fff",
        },
      });
      return push("/login");
    }
    // Add buy now logic here
    push("/checkout");
  };

  if (isLoading) return <SingleProductSkeleton />;
  if (error)
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Error Loading Product</h2>
          <p className="text-muted-foreground">
            Failed to load product with id {id}. Please try again.
          </p>
        </div>
      </div>
    );
  if (!data)
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );

  const { sizes, colors, mainImage, name, description, price, otherImages, categories } = data;
  const images = [mainImage, ...(Array.isArray(otherImages) ? otherImages : [])];
  const hasMultiImages = images.length > 1;

  // Mock related products - you should fetch these from your API
  const relatedProducts = [
    { id: "1", name: "Similar Product 1", price: price, mainImage: mainImage },
    { id: "2", name: "Similar Product 2", price: price, mainImage: mainImage },
    { id: "3", name: "Similar Product 3", price: price, mainImage: mainImage },
    { id: "4", name: "Similar Product 4", price: price, mainImage: mainImage },
  ].filter(p => p.id !== id);

  return (
    <main ref={containerRef} className="bg-background text-foreground">
      <ProductHero
        productName={name}
        description={description}
        categoryName={categories?.[0]?.name}
      />
      <div className="px-4 md:px-8 md:py-0 sm:py-8 max-w-7xl mx-auto">
        {hasMultiImages ? (
          <>
            {/* Desktop/Large screens: stacking animation */}
            <section
              ref={introSectionRef}
              className="relative hidden lg:block"
              style={{ height: `${Math.max(240, images.length * 150)}vh` }}
            >
              <div className="sticky" style={{ top: navHeight + 140 }}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Sidebar - Thumbnail Navigation */}
                  <div className="hidden lg:block lg:col-span-1">
                    <ImageSidebar
                      images={images}
                      productName={name}
                      onImageSelect={handleImageSelect}
                      activeIndex={activeImageIndex}
                    />
                  </div>

                  {/* Main Image Display (stacking) */}
                  <div className="lg:col-span-5">
                    <StickyImageStack
                      images={images}
                      productName={name}
                      mode="controlled"
                      progress={stackProgress}
                      disableInternalSticky
                      showThumbnails={false}
                      onStackingStateChange={handleStackingStateChange}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="lg:col-span-6 space-y-8 mb-8">
                    <ProductDetails
                      product={{
                        id,
                        name,
                        price,
                        description,
                        colors,
                        sizes,
                      }}
                      onAddToCart={handleAddToCart}
                      isAddingToCart={isAddingToCart}
                      onBuyNow={handleBuyNow}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Mobile/Small screens: simple switcher, no stacking */}
            <div className="lg:hidden">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <MainImageDisplay
                    images={images}
                    productName={name}
                    activeImageIndex={activeImageIndex}
                  />
                  <div className="mt-4 grid grid-cols-4 gap-3">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          index === activeImageIndex 
                            ? "border-primary ring-2 ring-primary/20" 
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <Image 
                          src={image || "/placeholder.svg"} 
                          alt={`Thumbnail ${index + 1}`} 
                          fill
                          className="object-cover" 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-8 mb-8">
                  <ProductDetails
                    product={{
                      id,
                      name,
                      price,
                      description,
                      colors,
                      sizes,
                    }}
                    onAddToCart={handleAddToCart}
                    isAddingToCart={isAddingToCart}
                    onBuyNow={handleBuyNow}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          // Single-image: render normal flow without pinned intro
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Thumbnail Navigation remains, but single item */}
            <div className="hidden lg:block lg:col-span-1">
              <ImageSidebar
                images={images}
                productName={name}
                onImageSelect={handleImageSelect}
                activeIndex={activeImageIndex}
              />
            </div>

            {/* Main Image Display (non-stacking) */}
            {(() => {
              console.log("product images:", images);
              return null;
            })()}
            <div className="lg:col-span-5">
              <MainImageDisplay
                images={images}
                productName={name}
                activeImageIndex={activeImageIndex}
              />

              {/* Mobile Thumbnail Navigation (single) */}
              <div className="lg:hidden mt-4 grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageSelect(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      index === activeImageIndex 
                        ? "border-primary ring-2 ring-primary/20" 
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <Image 
                      src={image || "/placeholder.svg"} 
                      alt={`Thumbnail ${index + 1}`} 
                      fill
                      className="object-cover" 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="lg:col-span-6 space-y-8 mb-8">
              <ProductDetails
                product={{
                  id,
                  name,
                  price,
                  description,
                  colors,
                  sizes,
                }}
                onAddToCart={handleAddToCart}
                isAddingToCart={isAddingToCart}
                onBuyNow={handleBuyNow}
              />
            </div>
          </div>
        )}
        <ReviewsSection />
      </div>
      <RelatedProducts products={relatedProducts} />
    </main>
  );
};

export default ProductPage;
