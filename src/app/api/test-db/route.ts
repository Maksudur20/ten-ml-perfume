import { NextResponse } from 'next/server'

export async function GET() {
  // Check if environment variable is set
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'MONGODB_URI environment variable is not configured',
        help: 'Add MONGODB_URI to your .env file with a valid MongoDB Atlas connection string',
        envSet: false,
      },
      { status: 500 }
    )
  }

  try {
    const clientPromise = await import('@/lib/mongodb').then((m) => m.default)
    const client = await clientPromise
    const db = client.db('perfume_store')

    // Test connection with ping
    await db.admin().ping()

    // Get database stats
    const stats = await db.stats()

    return NextResponse.json({
      status: 'success',
      message: 'Connected to MongoDB successfully!',
      database: db.databaseName,
      collections: stats.collections,
      dataSize: stats.dataSize,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('MongoDB connection error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Connection failed',
        error: String(error),
        help: 'Verify that MONGODB_URI in .env contains a valid MongoDB Atlas connection string and your IP is whitelisted',
      },
      { status: 500 }
    )
  }
}
