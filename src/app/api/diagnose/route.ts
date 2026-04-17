import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import mongoose from 'mongoose'

export const dynamic = 'force-dynamic'

export async function GET() {
  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      mongoUriConfigured: !!process.env.MONGODB_URI,
      mongoUri: process.env.MONGODB_URI ? `${process.env.MONGODB_URI.substring(0, 50)}...` : 'NOT SET',
      jwtSecretConfigured: !!process.env.JWT_SECRET,
      cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'NOT SET',
      cloudinaryKeyConfigured: !!process.env.CLOUDINARY_API_KEY,
      cloudinarySecretConfigured: !!process.env.CLOUDINARY_API_SECRET,
    },
    database: {
      connected: false,
      error: null as string | null,
      mongooseState: null as string | null,
    },
    tests: {
      importTest: 'PASS',
      connectionTest: 'PENDING',
    },
  }

  // Test Mongoose connection
  try {
    await connectDB()
    diagnostics.database.connected = true
    diagnostics.database.mongooseState = mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED'
    diagnostics.tests.connectionTest = 'PASS'

    // Try to count products
    try {
      const Product = mongoose.model('Product') || (await import('@/models/Product')).default
      const productCount = await Product.countDocuments()
      diagnostics.database['productCount'] = productCount
      diagnostics.database['error'] = null
    } catch (countError) {
      diagnostics.database['productCount'] = 'ERROR - Could not count products'
      diagnostics.database['error'] = countError instanceof Error ? countError.message : String(countError)
    }
  } catch (dbError) {
    diagnostics.database.connected = false
    diagnostics.database.error = dbError instanceof Error ? dbError.message : String(dbError)
    diagnostics.tests.connectionTest = 'FAIL'
  }

  return NextResponse.json(diagnostics, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}
