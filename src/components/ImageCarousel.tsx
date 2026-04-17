'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageCarouselProps {
  images: string[]
  alt: string
}

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // If only one image or empty, show just that image
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    )
  }

  if (images.length === 1) {
    return (
      <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        <img
          src={images[0]}
          alt={alt}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    )
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center group">
        <img
          src={images[currentIndex]}
          alt={alt}
          className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} className="text-gray-800" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition z-10"
              aria-label="Next image"
            >
              <ChevronRight size={24} className="text-gray-800" />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition flex items-center justify-center bg-gray-50 ${
                index === currentIndex ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              <Image
                src={image}
                alt={`${alt} ${index + 1}`}
                width={80}
                height={80}
                className="object-contain w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
