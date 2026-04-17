import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import Banner from '@/models/Banner'
import { extractTokenFromRequest, verifyToken } from '@/lib/auth'
import { Types } from 'mongoose'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Validate banner ID
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: 'Invalid banner ID' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { title, image, link, position, isActive, cloudinaryPublicId } = body

    await connectDB()

    // Find and update banner
    const updatedBanner = await Banner.findByIdAndUpdate(
      params.id,
      {
        ...(title && { title }),
        ...(image && { image }),
        ...(link && { link }),
        ...(position !== undefined && { position }),
        ...(isActive !== undefined && { isActive }),
        ...(cloudinaryPublicId && { cloudinaryPublicId }),
      },
      { new: true, runValidators: true }
    )

    if (!updatedBanner) {
      return NextResponse.json(
        { message: 'Banner not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        message: 'Banner updated successfully',
        banner: updatedBanner,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Update banner error:', error)
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

    // Validate banner ID
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: 'Invalid banner ID' },
        { status: 400 }
      )
    }

    await connectDB()

    // Find and delete banner
    const deletedBanner = await Banner.findByIdAndDelete(params.id)

    if (!deletedBanner) {
      return NextResponse.json(
        { message: 'Banner not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        message: 'Banner deleted successfully',
        banner: deletedBanner,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Delete banner error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
