'use client'

import { Suspense } from 'react'
import ShopPageContent from './shop-content'

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopPageContent />
    </Suspense>
  )
}
