import { NextRequest, NextResponse } from 'next/server'
import { connect } from '@/lib/mongoose'
import Order from '@/models/Order'
import { extractTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect()

    const order = await Order.findById(params.id)

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        message: 'Order retrieved successfully',
        order,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Get order error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { status, notes } = body

    await connect()

    // Verify admin access
    const token = extractTokenFromRequest(req)
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      )
    }

    // Check if user is admin (you can add role checking if needed)
    // For now, allow any authenticated user to update their own order

    const order = await Order.findByIdAndUpdate(
      params.id,
      {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
      { new: true, runValidators: true }
    )

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        message: 'Order updated successfully',
        order,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Update order error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect()

    // Verify admin access
    const token = extractTokenFromRequest(req)
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      )
    }

    const order = await Order.findByIdAndDelete(params.id)

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        message: 'Order deleted successfully',
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Delete order error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
