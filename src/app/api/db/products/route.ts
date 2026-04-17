import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('perfume_store')
    const productsCollection = db.collection('products')

    // Get query params for filtering
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const isHot = searchParams.get('isHot')
    const productId = searchParams.get('productId')

    // Build filter
    const filter: Record<string, unknown> = {}
    if (category) filter.category = category
    if (isHot === 'true') filter.isHot = true
    if (productId) {
      // Try to match by both id field and _id field
      const orConditions: Array<Record<string, unknown>> = [{ id: productId }]
      
      try {
        // If productId is a valid ObjectId hex string, also search by _id
        const objId = new ObjectId(productId)
        orConditions.push({ _id: objId })
      } catch {
        // Not a valid ObjectId, just search by id field
      }
      
      if (orConditions.length > 1) {
        filter.$or = orConditions
      } else {
        filter.id = productId
      }
    }

    const products = await productsCollection.find(filter).toArray()

    return NextResponse.json({
      status: 'success',
      count: products.length,
      products,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch products',
      },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('perfume_store')
    const productsCollection = db.collection('products')

    const product = await req.json()

    // Ensure product has an id field
    const productWithId = {
      ...product,
      id: product.id || Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await productsCollection.insertOne(productWithId)

    return NextResponse.json(
      {
        status: 'success',
        message: 'Product created',
        insertedId: result.insertedId,
        product: { ...productWithId, _id: result.insertedId },
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to create product',
      },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('perfume_store')
    const productsCollection = db.collection('products')

    const { id, ...productData } = await req.json()

    if (!id) {
      return NextResponse.json(
        { status: 'error', message: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Try ObjectId format first, then fall back to string match
    const filter: Record<string, unknown> = {}
    try {
      filter._id = new ObjectId(id)
    } catch {
      // If ObjectId fails, try matching by id field
      filter.id = id
    }

    const result = await productsCollection.updateOne(
      filter,
      {
        $set: {
          ...productData,
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      status: 'success',
      message: 'Product updated',
      modifiedCount: result.modifiedCount,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to update product',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('perfume_store')
    const productsCollection = db.collection('products')

    const { id } = await req.json()

    if (!id) {
      return NextResponse.json(
        { status: 'error', message: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Try ObjectId format first, then fall back to string match
    const filter: Record<string, unknown> = {}
    try {
      filter._id = new ObjectId(id)
    } catch {
      // If ObjectId fails, try matching by id field
      filter.id = id
    }

    const result = await productsCollection.deleteOne(filter)

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      status: 'success',
      message: 'Product deleted',
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete product',
      },
      { status: 500 }
    )
  }
}
