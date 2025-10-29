"use client"

import Image from "next/image"

interface ImageSidebarProps {
  images: string[]
  productName: string
  onImageSelect: (index: number) => void
  activeIndex: number
}

export default function ImageSidebar({ images, productName, onImageSelect, activeIndex }: ImageSidebarProps) {
  return (
    <div className="flex flex-col gap-3 h-fit sticky top-24">
      <style jsx>{`
        @keyframes pulse-border {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .active-thumbnail {
          animation: pulse-border 2s ease-in-out infinite;
        }
      `}</style>
      
      {images.map((image, index) => (
        <button
          key={index}
          onClick={() => onImageSelect(index)}
          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 group ${
            index === activeIndex 
              ? "border-primary ring-2 ring-primary/20 scale-105 shadow-lg" 
              : "border-border hover:border-muted-foreground hover:shadow-md"
          }`}
          aria-label={`View image ${index + 1}`}
          title={`View ${index + 1}`}
        >
          <Image 
            src={image || "/placeholder.svg"} 
            alt={`${productName} - Thumbnail ${index + 1}`} 
            fill 
            className={`object-cover transition-all duration-300 ${
              index === activeIndex ? "scale-110" : "group-hover:scale-110"
            }`}
            loading="lazy"
          />
          
          {/* Active indicator overlay */}
          {index === activeIndex && (
            <div className="absolute inset-0 bg-primary/10 pointer-events-none active-thumbnail" />
          )}
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 pointer-events-none" />
          
          {/* Image number badge */}
          <div className={`absolute top-1 right-1 text-xs px-1.5 py-0.5 rounded transition-all duration-300 ${
            index === activeIndex 
              ? "bg-primary text-primary-foreground font-medium" 
              : "bg-black/50 text-white opacity-0 group-hover:opacity-100"
          }`}>
            {index + 1}
          </div>
        </button>
      ))}
    </div>
  )
}
