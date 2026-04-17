import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { extractTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('perfume_store')
    const bannersCollection = db.collection('banners')

    // Get all active banners, sorted by position
    const banners = await bannersCollection
      .find({ isActive: true })
      .sort({ position: 1 })
      .toArray()

    return NextResponse.json(
      {
        message: 'Banners retrieved successfully',
        banners,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Get banners error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    const token = extractTokenFromRequest(req)
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.isAdmin) {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { title, image, link, position, isActive, cloudinaryPublicId } = body

    // Validate required fields
    if (!title || !image || !link) {
      return NextResponse.json(
        { message: 'Please provide title, image, and link' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('perfume_store')
    const bannersCollection = db.collection('banners')

    // Create new banner
    const result = await bannersCollection.insertOne({
      title,
      image,
      link,
      position: position || 0,
      isActive: isActive !== undefined ? isActive : true,
      cloudinaryPublicId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const newBanner = await bannersCollection.findOne({ _id: result.insertedId })

    return NextResponse.json(
      {
        message: 'Banner created successfully',
        banner: newBanner,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create banner error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
