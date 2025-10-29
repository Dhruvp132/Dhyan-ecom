"use client"

import Image from "next/image"
import { Star } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import Link from "next/link"

interface RelatedProduct {
  id: string
  name: string
  price: number
  mainImage: string
}

interface RelatedProductsProps {
  products: RelatedProduct[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const { ref, isVisible } = useScrollAnimation()

  if (!products || products.length === 0) {
    return null
  }

  return (
    <section ref={ref} className="bg-secondary/30 py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          className={`flex items-center justify-between mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-3xl md:text-4xl font-light tracking-tight">You May Also Like</h2>
          <Link href="/products" className="text-primary hover:text-primary/80 transition-colors font-medium">
            Discover More →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className={`group cursor-pointer transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
              }}
            >
              <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-secondary">
                <Image
                  src={product.mainImage || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <h3 className="font-medium text-lg mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
              <p className="text-lg font-light text-muted-foreground">RS. {product.price.toLocaleString()}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
