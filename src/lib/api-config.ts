// API Configuration
const API_CONFIG = {
  // Local development
  development: {
    backend: 'http://localhost:5000',
    frontend: 'http://localhost:3000',
  },
  // Production
  production: {
    backend: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://your-api.onrender.com',
    frontend: process.env.NEXT_PUBLIC_API_URL || 'https://your-app.vercel.app',
  },
}

const environment = process.env.NODE_ENV || 'development'
const config = API_CONFIG[environment as keyof typeof API_CONFIG]

export const API_BASE_URL = config.backend
export const FRONTEND_URL = config.frontend

// API Endpoints
export const API_ENDPOINTS = {
  // Products
  GET_PRODUCTS: '/api/products',
  GET_PRODUCT: (id: string) => `/api/products/${id}`,
  CREATE_PRODUCT: '/api/products',
  UPDATE_PRODUCT: (id: string) => `/api/products/${id}`,
  DELETE_PRODUCT: (id: string) => `/api/products/${id}`,

  // Upload
  UPLOAD_IMAGE: '/api/upload',

  // Auth (if applicable)
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',

  // Cart
  GET_CART: '/api/cart',
  ADD_TO_CART: '/api/cart/add',
  REMOVE_FROM_CART: '/api/cart/remove',

  // Database Test
  TEST_DB: '/api/test-db',
}

// Fetch helper with base URL
export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, defaultOptions)
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

export default config
