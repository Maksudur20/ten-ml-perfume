'use client'

import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  count?: number
  interactive?: boolean
  onRatingChange?: (rating: number) => void
}

export function StarRating({ rating, count, interactive = false, onRatingChange }: StarRatingProps) {
  const handleStarClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`transition cursor-pointer ${
              i < Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : i < rating
                ? 'fill-yellow-400 text-yellow-400 opacity-50'
                : 'text-gray-300'
            } ${interactive ? 'hover:fill-yellow-300 hover:text-yellow-300' : ''}`}
            onClick={() => handleStarClick(i)}
          />
        ))}
      </div>
      {count && <span className="text-xs text-gray-600">({count})</span>}
      <span className="text-sm font-semibold text-gray-900">{rating.toFixed(1)}</span>
    </div>
  )
}
