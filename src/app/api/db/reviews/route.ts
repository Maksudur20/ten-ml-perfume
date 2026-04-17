import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('perfume_store')
    const reviewsCollection = db.collection('reviews')

    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')

    const filter: Record<string, unknown> = {}
    if (productId) filter.productId = productId

    const reviews = await reviewsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      status: 'success',
      count: reviews.length,
      reviews,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch reviews',
      },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('perfume_store')
    const reviewsCollection = db.collection('reviews')

    const review = await req.json()

    const reviewWithMetadata = {
      ...review,
      createdAt: new Date(),
      updatedAt: new Date(),
      helpful: 0,
    }

    const result = await reviewsCollection.insertOne(reviewWithMetadata)

    return NextResponse.json(
      {
        status: 'success',
        message: 'Review created',
        reviewId: result.insertedId,
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to create review',
      },
      { status: 500 }
    )
  }
}
