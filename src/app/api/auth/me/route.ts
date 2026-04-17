import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { verifyToken } from '@/lib/auth'
import { ObjectId } from 'mongodb'

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

    const client = await clientPromise
    const db = client.db('perfume_store')
    const usersCollection = db.collection('users')

    const user = await usersCollection.findOne({
      _id: new ObjectId(decoded.userId)
    })

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
