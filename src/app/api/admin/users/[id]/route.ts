import { NextRequest, NextResponse } from 'next/server'
import { connect } from '@/lib/mongoose'
import User from '@/models/User'
import Order from '@/models/Order'
import { extractTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
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

    await connect()

    const user = await User.findById(params.id, { password: 0 })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    // Get user's orders
    const orders = await Order.find({ userId: params.id }).sort({ createdAt: -1 })

    return NextResponse.json(
      {
        message: 'User retrieved successfully',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
        orders,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Get user error:', error)
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
    // Check authentication
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

    // Prevent deleting yourself
    if (decoded.userId === params.id) {
      return NextResponse.json(
        { message: 'You cannot delete your own account' },
        { status: 400 }
      )
    }

    await connect()

    const user = await User.findByIdAndDelete(params.id)

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    // Optionally delete or archive their orders
    // For now, we'll keep the orders for record keeping
    // await Order.deleteMany({ userId: params.id })

    return NextResponse.json(
      {
        message: 'User deleted successfully',
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
