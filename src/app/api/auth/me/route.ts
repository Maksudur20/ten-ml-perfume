import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    await connectDB()

    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        name: user.username,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Auth verification error:', error)
    return NextResponse.json({ message: 'Authentication failed' }, { status: 401 })
  }
}
