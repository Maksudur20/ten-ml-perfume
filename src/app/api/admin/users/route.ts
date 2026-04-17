import { NextRequest, NextResponse } from 'next/server'
import { connect } from '@/src/lib/mongoose'
import User from '@/src/models/User'
import Order from '@/src/models/Order'
import { extractTokenFromRequest, verifyToken } from '@/src/lib/auth'

export async function GET(req: NextRequest) {
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

    // Get all users with order count
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 })

    // Enrich users with order count
    const usersWithOrderCount = await Promise.all(
      users.map(async (user) => {
        const orderCount = await Order.countDocuments({ userId: user._id.toString() })
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          orders: orderCount,
        }
      })
    )

    return NextResponse.json(
      {
        message: 'Users retrieved successfully',
        users: usersWithOrderCount,
        total: usersWithOrderCount.length,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
