import type { Metadata } from 'next'
import { CartProvider } from '@/context/CartContext'
import { AdminProvider } from '@/context/AdminContext'
import { OrderProvider } from '@/context/OrderContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { NotificationProvider } from '@/context/NotificationContext'
import { ReviewProvider } from '@/context/ReviewContext'
import { ProductCacheProvider } from '@/context/ProductCacheContext'
import { AuthProvider } from '@/context/AuthContext'
import './globals.css'

export const metadata: Metadata = {
  title: '10ML Perfume - Premium Perfume Decants',
  description: 'Discover the finest 100% authentic perfume decants. Fast shipping, 24/7 support.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <ProductCacheProvider>
            <AdminProvider>
              <OrderProvider>
                <CartProvider>
                  <WishlistProvider>
                    <NotificationProvider>
                      <ReviewProvider>
                        {children}
                      </ReviewProvider>
                    </NotificationProvider>
                  </WishlistProvider>
                </CartProvider>
              </OrderProvider>
            </AdminProvider>
          </ProductCacheProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
