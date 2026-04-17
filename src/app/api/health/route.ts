import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    features: {
      authentication: 'enabled',
      products: 'enabled',
      banners: 'enabled',
      orders: 'enabled',
    },
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}
