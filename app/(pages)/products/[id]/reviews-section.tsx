"use client"

import { Star } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

interface Review {
  id: number
  author: string
  rating: number
  title: string
  content: string
  date: string
  verified: boolean
}

const REVIEWS: Review[] = [
  {
    id: 1,
    author: "Arjun K.",
    rating: 5,
    title: "Absolutely Premium Quality",
    content:
      "The quality is exceptional. The fabric feels luxurious and the print is perfectly done. Fits true to size and the oversized look is exactly what I wanted.",
    date: "2 weeks ago",
    verified: true,
  },
  {
    id: 2,
    author: "Priya M.",
    rating: 5,
    title: "Worth Every Rupee",
    content:
      "Delivery was fast and the packaging was premium. The t-shirt looks even better in person. Highly recommend for anyone looking for quality streetwear.",
    date: "1 month ago",
    verified: true,
  },
  {
    id: 3,
    author: "Rohan S.",
    rating: 4,
    title: "Great Design, Perfect Fit",
    content:
      "Love the design and the fit is perfect. Only minor thing is the print could be slightly more vibrant, but overall very happy with the purchase.",
    date: "1 month ago",
    verified: true,
  },
]

export default function ReviewsSection() {
  const averageRating = (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length).toFixed(1)
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section
      ref={ref}
      className={`space-y-8 pt-8 border-t border-border transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div>
        <h3 className="text-2xl font-light tracking-tight mb-4">Customer Reviews</h3>

        {/* Rating Summary */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-light">{averageRating}</span>
            <span className="text-muted-foreground">out of 5</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={20}
                className={
                  i < Math.round(Number.parseFloat(averageRating)) ? "fill-primary text-primary" : "text-border"
                }
              />
            ))}
          </div>
          <span className="text-muted-foreground">({REVIEWS.length} reviews)</span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {REVIEWS.map((review, index) => (
          <div
            key={review.id}
            className={`pb-6 border-b border-border last:border-b-0 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{
              transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{review.author}</span>
                  {review.verified && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Verified Purchase</span>
                  )}
                </div>
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating ? "fill-primary text-primary" : "text-border"}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{review.date}</span>
            </div>
            <h4 className="font-medium mb-2">{review.title}</h4>
            <p className="text-muted-foreground leading-relaxed">{review.content}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
