'use client'

import React, { createContext, useContext, useState } from 'react'

export interface ProductReview {
  id: string
  productId: string
  rating: number
  title: string
  comment: string
  author: string
  createdAt: Date
  verified: boolean
}

interface ReviewContextType {
  reviews: ProductReview[]
  addReview: (review: Omit<ProductReview, 'id' | 'createdAt'>) => void
  getProductReviews: (productId: string) => ProductReview[]
  getAverageRating: (productId: string) => number
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined)

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<ProductReview[]>([
    {
      id: '1',
      productId: '1',
      rating: 5,
      title: 'Amazing fragrance!',
      comment: 'The quality is excellent and the service is top notch.',
      author: 'Ahmed',
      createdAt: new Date('2024-01-15'),
      verified: true,
    },
    {
      id: '2',
      productId: '1',
      rating: 4,
      title: 'Great value',
      comment: 'Good value for money. Highly recommend.',
      author: 'Fatima',
      createdAt: new Date('2024-01-10'),
      verified: true,
    },
  ])

  const addReview = (review: Omit<ProductReview, 'id' | 'createdAt'>) => {
    const newReview: ProductReview = {
      ...review,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setReviews((prev) => [newReview, ...prev])
  }

  const getProductReviews = (productId: string) => {
    return reviews.filter((review) => review.productId === productId)
  }

  const getAverageRating = (productId: string) => {
    const productReviews = getProductReviews(productId)
    if (productReviews.length === 0) return 0
    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0)
    return Math.round((sum / productReviews.length) * 10) / 10
  }

  return (
    <ReviewContext.Provider value={{ reviews, addReview, getProductReviews, getAverageRating }}>
      {children}
    </ReviewContext.Provider>
  )
}

export function useReview() {
  const context = useContext(ReviewContext)
  if (!context) {
    throw new Error('useReview must be used within ReviewProvider')
  }
  return context
}
