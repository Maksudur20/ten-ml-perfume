import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function searchFragrantica(perfumeName: string, brand: string) {
  try {
    // Construct fragrantica search URL
    const searchQuery = encodeURIComponent(`${brand} ${perfumeName}`)
    const searchUrl = `https://www.fragrantica.com/search/products/?q=${searchQuery}`

    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Referer': 'https://www.fragrantica.com/',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      // Fragrantica often blocks automated requests (e.g. 403).
      // Treat this as a normal "no image" outcome to avoid spamming logs.
      if (response.status !== 403) {
        console.warn(`Fragrantica response not OK: ${response.status}`)
      }
      return null
    }

    const html = await response.text()

    // Extract image URL from HTML - look for product images in search results
    // Pattern: src="https://www.fragrantica.com/img/bottle/[id].jpg"
    const bottleImageRegex = /src="(https:\/\/www\.fragrantica\.com\/img\/bottle\/\d+\.jpg)"/i
    const match = html.match(bottleImageRegex)

    if (match && match[1]) {
      return match[1]
    }

    // Alternative pattern for product pages
    const productImageRegex = /og:image"\s+content="(https:\/\/www\.fragrantica\.com\/img\/bottle\/\d+\.jpg)"/i
    const altMatch = html.match(productImageRegex)

    if (altMatch && altMatch[1]) {
      return altMatch[1]
    }

    return null
  } catch (error) {
    console.error('Error searching fragrantica:', error instanceof Error ? error.message : String(error))
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const perfumeName = request.nextUrl.searchParams.get('name')
    const brand = request.nextUrl.searchParams.get('brand')

    if (!perfumeName || !brand) {
      return NextResponse.json(
        { error: 'Missing perfumeName or brand parameter' },
        { status: 400 }
      )
    }

    const imageUrl = await searchFragrantica(perfumeName, brand)

    if (imageUrl) {
      return NextResponse.json({ success: true, imageUrl })
    } else {
      // Return success with null imageUrl instead of 404 to avoid errors on client
      return NextResponse.json({ success: false, imageUrl: null }, { status: 200 })
    }
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ success: false, imageUrl: null }, { status: 200 })
  }
}
