import { NextRequest, NextResponse } from 'next/server'
import { connect } from '@/lib/mongoose'
import Banner from '@/models/Banner'
import { extractTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    await connect()

    // Get all active banners, sorted by position
    const banners = await Banner.find({ isActive: true }).sort({ position: 1 })

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

    await connect()

    // Create new banner
    const newBanner = await Banner.create({
      title,
      image,
      link,
      position: position || 0,
      isActive: isActive !== undefined ? isActive : true,
      cloudinaryPublicId,
    })

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
