import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { extractTokenFromRequest, verifyToken } from '@/lib/auth'
import { ObjectId } from 'mongodb'

// Generate unique tracking code
function generateTrackingCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('perfume_store')
    const ordersCollection = db.collection('orders')

    // Check if user is authenticated
    const token = extractTokenFromRequest(req)
    let userId = null

    if (token) {
      const decoded = verifyToken(token)
      if (decoded) {
        userId = decoded.userId
      }
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const trackingCode = searchParams.get('trackingCode')
    const email = searchParams.get('email')

    let orders

    if (trackingCode) {
      // Get order by tracking code
      orders = await ordersCollection.findOne({ trackingCode: trackingCode.toUpperCase() })
    } else if (userId) {
      // Get all orders for authenticated user
      orders = await ordersCollection
        .find({ userId: new ObjectId(userId) })
        .sort({ createdAt: -1 })
        .toArray()
    } else if (email) {
      // Get orders by email (for guests)
      orders = await ordersCollection
        .find({ customerEmail: email.toLowerCase() })
        .sort({ createdAt: -1 })
        .toArray()
    } else {
      return NextResponse.json(
        { message: 'Please provide trackingCode, email, or authenticate' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        message: 'Orders retrieved successfully',
        orders: orders || [],
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      items,
      subtotal,
      discount,
      deliveryCharge,
      total,
      paymentMethod,
      notes,
    } = body

    // Validate required fields
    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !customerAddress ||
      !customerCity ||
      !items ||
      items.length === 0 ||
      total === undefined
    ) {
      return NextResponse.json(
        { message: 'Please provide all required order information' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('perfume_store')
    const ordersCollection = db.collection('orders')

    // Get userId if authenticated
    const token = extractTokenFromRequest(req)
    let userId = null

    if (token) {
      const decoded = verifyToken(token)
      if (decoded) {
        userId = new ObjectId(decoded.userId)
      }
    }

    // Generate unique tracking code
    let trackingCode = generateTrackingCode()
    let existingOrder = await ordersCollection.findOne({ trackingCode })
    while (existingOrder) {
      trackingCode = generateTrackingCode()
      existingOrder = await ordersCollection.findOne({ trackingCode })
    }

    // Create new order
    const result = await ordersCollection.insertOne({
      userId,
      trackingCode,
      customerName,
      customerEmail: customerEmail.toLowerCase(),
      customerPhone,
      customerAddress,
      customerCity,
      items,
      subtotal,
      discount: discount || 0,
      deliveryCharge: deliveryCharge || 0,
      total,
      status: 'pending',
      paymentMethod,
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const newOrder = await ordersCollection.findOne({ _id: result.insertedId })

    return NextResponse.json(
      {
        message: 'Order created successfully',
        order: newOrder,
        trackingCode: newOrder?.trackingCode,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
