import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import Order from '@/models/Order'
import { extractTokenFromRequest, verifyToken } from '@/lib/auth'

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
    await connectDB()

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
      orders = await Order.findOne({ trackingCode: trackingCode.toUpperCase() })
    } else if (userId) {
      // Get all orders for authenticated user
      orders = await Order.find({ userId }).sort({ createdAt: -1 })
    } else if (email) {
      // Get orders by email (for guests)
      orders = await Order.find({ customerEmail: email.toLowerCase() }).sort({ createdAt: -1 })
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

    await connectDB()

    // Get userId if authenticated
    const token = extractTokenFromRequest(req)
    let userId = null

    if (token) {
      const decoded = verifyToken(token)
      if (decoded) {
        userId = decoded.userId
      }
    }

    // Generate unique tracking code
    let trackingCode = generateTrackingCode()
    let existingOrder = await Order.findOne({ trackingCode })
    while (existingOrder) {
      trackingCode = generateTrackingCode()
      existingOrder = await Order.findOne({ trackingCode })
    }

    // Create new order
    const newOrder = await Order.create({
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
    })

    return NextResponse.json(
      {
        message: 'Order created successfully',
        order: newOrder,
        trackingCode: newOrder.trackingCode,
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
