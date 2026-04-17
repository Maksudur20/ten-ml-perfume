import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('perfume_store')
    const ordersCollection = db.collection('orders')

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const filter: Record<string, unknown> = {}
    if (status) filter.status = status

    const orders = await ordersCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      status: 'success',
      count: orders.length,
      orders,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch orders',
      },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('perfume_store')
    const ordersCollection = db.collection('orders')

    const order = await req.json()

    const orderWithMetadata = {
      ...order,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await ordersCollection.insertOne(orderWithMetadata)

    return NextResponse.json(
      {
        status: 'success',
        message: 'Order created',
        orderId: result.insertedId,
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to create order',
      },
      { status: 500 }
    )
  }
}
