# Product Visibility Issue - Root Cause Analysis & Fix

## The Problem

When an admin uploads a product from the admin panel, it was NOT appearing on the homepage for other users on different devices. However, if those users logged into the admin panel on that device, the product would suddenly appear.

### Why This Was Happening

**Root Cause: Static Data Import**

The homepage and shop pages were using a **static import** of products that never updated:

```typescript
// ❌ WRONG - This imports only once, never refetches
import { products } from '@/data/products'

export default function Home() {
  const { adminProducts } = useAdmin()
  const allProducts = [...products, ...adminProducts]  // Mixes static + dynamic data
}
```

**Why it worked after admin login:**
- The AdminContext would update `adminProducts` from state
- The component would re-render showing newly added products
- But this only worked in that user's session

**Why other devices couldn't see new products:**
- They never imported fresh `products` from the database
- The static `products` array was locked at page load
- They didn't have the admin context data

---

## The Solution

### 1. New Hook: `useProducts` 
**File: `src/hooks/useProducts.ts`**

This hook:
- Fetches products from `/api/products` on component mount
- Includes cache-busting headers and timestamp parameters
- Normalizes MongoDB documents to the Product interface
- Handles loading and error states
- Prevents race conditions with request ID tracking

```typescript
const { products, loading, error, refetch } = useProducts()
```

### 2. Updated `/api/products` Endpoint
**File: `src/app/api/products/route.ts`**

Now includes proper cache-control headers:
```typescript
headers: {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
}
```

This ensures every request gets fresh data from MongoDB.

### 3. ProductCacheContext
**File: `src/context/ProductCacheContext.tsx`**

Provides a way to invalidate product cache across the app:
```typescript
const { invalidateProductCache } = useProductCache()
// Call this after adding/updating/deleting a product
invalidateProductCache()
```

### 4. Updated Homepage & Shop
**Files: `src/app/page.tsx` and `src/app/shop/shop-content.tsx`**

Now use the dynamic `useProducts` hook instead of static imports:
```typescript
// ✅ CORRECT - Fetches fresh data from database
const { products, loading, error } = useProducts()
```

---

## How It Works Now

### When an Admin Adds a Product:

1. **API saves to MongoDB** (`/api/db/products` or `/api/products`)
2. **Database is updated immediately**
3. **Next user visit (any device):**
   - Browser fetches fresh data from `/api/products`
   - Cache-control headers prevent browser caching
   - Timestamp parameter forces server re-evaluation
   - User sees the new product instantly ✅

### Key Differences:

| Before | After |
|--------|-------|
| Static import at build time | Dynamic fetch on every mount |
| No refresh without page reload | Fresh data on every visit |
| Other users needed admin login | All users see new products immediately |
| Different data per session | Consistent data across all users |

---

## Testing the Fix

### Test Case 1: Cross-Device Visibility

1. **Device A (Admin):** Add a new product in admin panel
2. **Device B (User):** Open homepage
   - ✅ Should see the new product immediately
   - ✅ No need to login or refresh admin panel

### Test Case 2: Browser Cache Busting

1. **Device C (User):** Add product
2. **Device D (User):** Open homepage
3. **Check Network tab:**
   - ✅ Request includes `Cache-Control: no-store` header
   - ✅ Response includes `_t` timestamp parameter
   - ✅ No browser caching

### Test Case 3: Rapid Updates

1. **Admin:** Add 3 products rapidly
2. **Users (multiple devices):** Refresh homepage
   - ✅ All 3 products appear immediately
   - ✅ No stale data visible

---

## Architecture Improvements

### Data Flow

```
Admin Panel 
  ↓ (Uploads product)
MongoDB Database
  ↓ (Fresh query)
/api/products (No-cache headers)
  ↓ (Every device fetches)
useProducts Hook (Cache busting)
  ↓ (Instant UI update)
Homepage / Shop (All users)
```

### Client-Side State Management

- **No static imports** - Everything is fetched dynamically
- **Loading states** - Users see "Loading products..." while fetching
- **Error handling** - Network issues show friendly error messages
- **Race condition prevention** - Request ID tracking prevents stale updates

---

## Code Changes Summary

### Files Modified:
1. **`src/hooks/useProducts.ts`** - New hook for dynamic product fetching
2. **`src/context/ProductCacheContext.tsx`** - New context for cache invalidation
3. **`src/app/page.tsx`** - Updated to use useProducts hook
4. **`src/app/shop/shop-content.tsx`** - Updated to use useProducts hook
5. **`src/app/api/products/route.ts`** - Added cache-control headers
6. **`src/app/layout.tsx`** - Added ProductCacheProvider

### Key Changes:

**Before:**
```typescript
import { products } from '@/data/products'  // ❌ Static
const allProducts = [...products, ...adminProducts]
```

**After:**
```typescript
const { products, loading, error } = useProducts()  // ✅ Dynamic
```

---

## Deployment Checklist

- [x] Verify `/api/products` returns fresh data from MongoDB
- [x] Confirm cache-control headers are set correctly
- [x] Test cross-device visibility
- [x] Verify no browser caching of product lists
- [x] Check loading states on slow networks
- [x] Monitor error handling in Network tab
- [x] Test admin product creation/update
- [x] Verify homepage and shop pages load products

---

## Future Improvements

### Option 1: Real-time Updates (WebSockets)
```typescript
const socket = useSocket()
socket.on('product:created', () => refetch())
```

### Option 2: Background Refresh
```typescript
const { products, refetch } = useProducts()
useEffect(() => {
  const interval = setInterval(refetch, 30000) // Refresh every 30s
  return () => clearInterval(interval)
}, [])
```

### Option 3: Stale-While-Revalidate
```typescript
fetch('/api/products', {
  headers: {
    'Cache-Control': 'stale-while-revalidate=60'
  }
})
```

---

## Technical Details

### Why the Static Import Was a Problem

```typescript
// TypeScript/Build Time
import { products } from '@/data/products'  // Imported once
// products = [{ id: 1, name: 'Product 1' }, ...]

// Runtime
export default Home() {
  // products still = [{ id: 1, name: 'Product 1' }, ...]
  // Even if MongoDB has new products, this never updates
}
```

### How useProducts Solves It

```typescript
// Every time component mounts
const { products } = useProducts()
// useEffect runs → fetch('/api/products')
// setState(freshDataFromMongoDB)
// Component re-renders with latest data
```

---

## Migration Guide for Other Components

If you have other components showing products:

### Old Way ❌
```typescript
import { products } from '@/data/products'
export function MyComponent() {
  return products.map(p => <div>{p.name}</div>)
}
```

### New Way ✅
```typescript
import { useProducts } from '@/hooks/useProducts'
export function MyComponent() {
  const { products, loading } = useProducts()
  if (loading) return <div>Loading...</div>
  return products.map(p => <div>{p.name}</div>)
}
```

---

## Summary

The product visibility issue was caused by **static data imports** that never refetched from the database. 

**The fix:**
1. Created `useProducts` hook for dynamic data fetching
2. Added proper cache-control headers to API
3. Implemented cache-busting on client side
4. Updated homepage and shop to use dynamic hook

**Result:** Products are now visible immediately on all devices without requiring any admin panel interaction.

✅ **Products appear instantly for all users across all devices**
