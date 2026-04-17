'use client'

import { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface BannerItem {
  id: number
  title: string
  description: string
  icon: string
  bgColor: string
  textColor: string
  buttonText: string
  buttonLink: string
}

const bannerItems: BannerItem[] = [
  {
    id: 1,
    title: 'Summer Collection 🌞',
    description: 'Fresh and vibrant fragrances perfect for summer ',
    icon: '☀️',
    bgColor: 'from-burgundy-600 to-burgundy-700',
    textColor: 'text-white',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
  },
  {
    id: 2,
    title: 'Premium Niche Brands 👑',
    description: 'Exclusive luxury fragrances from worldwide niche houses',
    icon: '✨',
    bgColor: 'from-burgundy-700 to-burgundy-800',
    textColor: 'text-white',
    buttonText: 'Explore',
    buttonLink: '/shop',
  },
  {
    id: 3,
    title: 'Limited Time Offer 🎁',
    description: 'Get up to 30% off on selected premium fragrances',
    icon: '🎉',
    bgColor: 'from-accent to-accent/80',
    textColor: 'text-burgundy-900',
    buttonText: 'Grab Offer',
    buttonLink: '/shop',
  },
  {
    id: 4,
    title: '24/7 Free Support 💬',
    description: 'Chat with us anytime on WhatsApp for fragrance advice',
    icon: '📱',
    bgColor: 'from-green-500 to-emerald-600',
    textColor: 'text-white',
    buttonText: 'Contact Us',
    buttonLink: '/contact',
  },
]

export function Banner() {
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerItems.length)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [autoPlay])

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % bannerItems.length)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 1000)
  }

  const goToSlide = (index: number) => {
    setCurrent(index)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 1000)
  }

  const item = bannerItems[current]

  return (
    <div className="w-full bg-burgundy-900 py-2">
      <div className="relative overflow-hidden">
        {/* Banner Slider */}
        <div className="relative h-24 md:h-32 flex items-center">
          {/* Animated Background */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${item.bgColor} transition-all duration-700`}
          />

          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* Content - Slides in from left */}
          <div
            key={current}
            className={`relative z-10 w-full px-4 md:px-8 transform animation-slide-in`}
            style={{
              animation: `slideInLeft 0.7s ease-out`,
            }}
          >
            <div className="flex items-center justify-between gap-4 md:gap-8">
              {/* Icon and Text */}
              <div className="flex-1">
                <div className="flex items-center gap-2 md:gap-4">
                  <span className="text-3xl md:text-5xl">{item.icon}</span>
                  <div>
                    <h3 className={`text-lg md:text-2xl font-bold ${item.textColor} leading-tight`}>
                      {item.title}
                    </h3>
                    <p className={`text-sm md:text-base ${item.textColor} opacity-90 line-clamp-1`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href={item.buttonLink}
                className="btn-glass-light flex items-center gap-2 px-4 md:px-6 py-2 font-bold whitespace-nowrap"
              >
                <span>{item.buttonText}</span>
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={nextSlide}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 transition text-white group"
          aria-label="Next banner"
        >
          <ChevronRight size={24} className="group-hover:translate-x-1 transition" />
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {bannerItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all rounded-full ${
                index === current ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
