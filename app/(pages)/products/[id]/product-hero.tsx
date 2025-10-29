"use client"

import { useEffect, useState } from "react"

interface ProductHeroProps {
  productName: string
  description: string
  categoryName?: string
}

export default function ProductHero({ productName, description, categoryName }: ProductHeroProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative bg-gradient-to-b from-background to-secondary/20 py-12 md:py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-8 md:mb-12">
          <a href="/" className="hover:text-foreground transition-colors">
            HOME
          </a>
          <span>›</span>
          <a href="/products" className="hover:text-foreground transition-colors">
            ALL PRODUCTS
          </a>
          {categoryName && (
            <>
              <span>›</span>
              <span className="text-foreground font-medium uppercase">{categoryName}</span>
            </>
          )}
          <span>›</span>
          <span className="text-foreground font-medium uppercase">{productName}</span>
        </nav>

        {/* Hero Content */}
        <div
          className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-4 text-balance">
            {productName}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}
