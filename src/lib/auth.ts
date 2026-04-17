import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export interface AuthPayload {
  userId: string
  username: string
  email: string
  isAdmin: boolean
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
    ) as AuthPayload
    return decoded
  } catch (error) {
    return null
  }
}

export function extractTokenFromRequest(req: NextRequest): string | null {
  // Try to get token from Authorization header
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Try to get token from cookies
  const token = req.cookies.get('authToken')?.value
  return token || null
}

export function extractTokenFromCookie(cookieString: string | undefined): string | null {
  if (!cookieString) return null
  
  const cookies = cookieString.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=')
    acc[key] = value
    return acc
  }, {} as Record<string, string>)
  
  return cookies.authToken || null
}
