'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Banner {
  _id: string
  title: string
  image: string
  link: string
  position: number
}

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners')
      const data = await response.json()
      if (data.banners) {
        setBanners(data.banners)
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay || banners.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [autoPlay, banners.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index % banners.length)
    setAutoPlay(false)
    // Resume auto-play after 10 seconds
    setTimeout(() => setAutoPlay(true), 10000)
  }

  const nextSlide = () => {
    goToSlide(currentSlide + 1)
  }

  const prevSlide = () => {
    goToSlide(currentSlide - 1)
  }

  if (loading) {
    return (
      <div className="w-full h-96 bg-burgundy-100 animate-pulse rounded-lg"></div>
    )
  }

  if (banners.length === 0) {
    return null
  }

  const currentBanner = banners[currentSlide]

  return (
    <div
      className="relative w-full h-96 rounded-lg overflow-hidden group"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <Link key={banner._id} href={banner.link}>
            <div
              className={`absolute w-full h-full transition-opacity duration-500 ease-in-out cursor-pointer ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/30"></div>

              {/* Banner text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center px-4 drop-shadow-lg">
                  {banner.title}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-burgundy-900 p-2 rounded-full z-10 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-burgundy-900 p-2 rounded-full z-10 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots/Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
