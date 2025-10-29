"use client"

import { useState } from "react"
import { Heart, ShoppingCart, Check } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

interface ProductDetailsProps {
  product: {
    id: string
    name: string
    price: number
    description: string
    colors?: string[]
    sizes?: string[]
  }
  onAddToCart: (color: string, size: string, quantity: number) => void
  isAddingToCart: boolean
  onBuyNow?: () => void
}

export default function ProductDetails({ product, onAddToCart, isAddingToCart, onBuyNow }: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "")
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const { ref, isVisible } = useScrollAnimation()

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      return
    }
    onAddToCart(selectedColor, selectedSize || "", quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const getColorName = (hex: string) => {
    // Simple color name mapping - you can expand this
    const colorMap: Record<string, string> = {
      "#5C4033": "Brown",
      "#1A1A1A": "Black",
      "#F5F1E8": "Cream",
      "#FFFFFF": "White",
      "#FF0000": "Red",
      "#0000FF": "Blue",
      "#00FF00": "Green",
    }
    return colorMap[hex.toUpperCase()] || hex
  }

  return (
    <article
      ref={ref}
      className={`space-y-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-scale {
          animation: fadeInScale 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>

      {/* Price and Title */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-2">{product.name}</h2>
            <p className="text-2xl font-light text-muted-foreground">RS. {product.price.toLocaleString()}</p>
          </div>
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="p-3 rounded-full border border-border hover:bg-secondary transition-colors"
            aria-label="Add to favorites"
          >
            <Heart size={24} className={isFavorited ? "fill-primary text-primary" : "text-muted-foreground"} />
          </button>
        </div>
      </div>

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-4">
          <label className="text-sm font-medium tracking-wide">COLOR</label>
          <div className="flex gap-3">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-12 h-12 rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? "border-primary scale-110"
                    : "border-border hover:border-muted-foreground"
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select ${getColorName(color)} color`}
                title={getColorName(color)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium tracking-wide">SIZE</label>
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              SIZE CHART
            </button>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-3 px-2 rounded-lg border-2 font-medium text-sm transition-all ${
                  selectedSize === size
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-muted-foreground"
                }`}
                aria-pressed={selectedSize === size}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selection */}
      <div className="space-y-4">
        <label className="text-sm font-medium tracking-wide">QUANTITY</label>
        <div className="flex items-center gap-4 w-fit">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-lg border border-border hover:bg-secondary transition-colors"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 rounded-lg border border-border hover:bg-secondary transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || (product.sizes && product.sizes.length > 0 && !selectedSize)}
          className={`w-full py-4 px-6 rounded-lg font-medium text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            isAdded || isAddingToCart
              ? "bg-primary text-primary-foreground"
              : "bg-primary text-primary-foreground hover:opacity-90"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isAddingToCart ? (
            "Adding..."
          ) : isAdded ? (
            <>
              <Check size={20} />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart size={20} />
              Add to Cart
            </>
          )}
        </button>
        <button
          onClick={onBuyNow}
          className="w-full py-4 px-6 rounded-lg border-2 border-primary font-medium text-lg hover:bg-secondary transition-colors"
        >
          Buy Now
        </button>
      </div>

      {/* Product Description */}
      <div className="space-y-4 pt-8 border-t border-border">
        <h3 className="text-lg font-medium tracking-wide">DESCRIPTION</h3>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>{product.description}</p>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-lg font-medium tracking-wide">SHIPPING</h3>
        <ul className="space-y-2 text-muted-foreground text-sm">
          <li>✓ Packed within 24 hours</li>
          <li>✓ Free delivery pan-India</li>
          <li>✓ Dispatches next day</li>
        </ul>
      </div>
    </article>
  )
}
