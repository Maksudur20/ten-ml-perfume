'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Banner } from '@/components/Banner'
import { ProductGrid } from '@/components/ProductGrid'
import { products } from '@/data/products'
import Link from 'next/link'
import { useAdmin } from '@/context/AdminContext'

export default function Home() {
  const { adminProducts } = useAdmin()
  const allProducts = [...products, ...adminProducts]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-burgundy-900 text-white py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
          </div>
          
          <div className="container-fluid relative z-10 text-center">
            <div className="mb-6">
              <h2 className="text-accent text-2xl md:text-3xl font-bold tracking-widest uppercase">Want authentic Decants?</h2>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              I <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent">got</span> you
            </h1>
            
            <p className="text-xl md:text-2xl text-burgundy-100 mb-8 max-w-3xl mx-auto leading-relaxed font-bold">
              Explore the collection and get yours
            </p>
            
            <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
              <Link href="/shop" className="btn-glass-light text-lg px-8 py-4">
                EXPLORE COLLECTION
              </Link>
              <button className="btn-glass-dark text-lg px-8 py-4 flex items-center justify-center space-x-2">
                <span>💬</span>
                <span>CHAT ON WHATSAPP</span>
              </button>
            </div>

            <div className="flex justify-center gap-8 text-center pt-8 border-t border-burgundy-700">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-accent">100+</p>
                <p className="text-burgundy-100 mt-2">Premium Fragrances</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-accent">20+</p>
                <p className="text-burgundy-100 mt-2">Niche Houses</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-accent">24/7</p>
                <p className="text-burgundy-100 mt-2">Customer Support</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Banner Section */}
        <Banner />

        {/* Premium Info Banner */}
        <section className="bg-gradient-to-r from-burgundy-50 to-accent/10 border-l-4 border-burgundy-700 py-8 my-8">
          <div className="container-fluid">
            <div className="flex items-start space-x-4">
              <span className="text-4xl">✨</span>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-burgundy-900 mb-2">
                  100% Authenticated Decants
                </h3>
                <p className="text-burgundy-700 text-lg">
                  Every decant is crafted fresh from authentic bottles with our imported travel atomizers. No mixtures. No dilutions. Pure fragrance, pure elegance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sourcing Section */}
        <section className="bg-white py-12">
          <div className="container-fluid">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-burgundy-700 mb-3">100+</p>
                <p className="text-gray-700 text-lg font-semibold">Designer & Niche Fragrances</p>
                <p className="text-gray-600 mt-2">Carefully curated collection</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-burgundy-700 mb-3">20+</p>
                <p className="text-gray-700 text-lg font-semibold">Renowned Niche Houses</p>
                <p className="text-gray-600 mt-2">Premium brands worldwide</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-pink-600 mb-3">🌍</p>
                <p className="text-gray-700 text-lg font-semibold">International Sourcing</p>
                <p className="text-gray-600 mt-2">From Germany, UK & UAE Markets</p>
              </div>
            </div>
          </div>
        </section>

        {/* Collection Section */}
        <section className="container-fluid py-16">
          <div className="text-center mb-16">
            <p className="text-burgundy-700 text-lg font-semibold tracking-widest uppercase mb-3">Curated Selection</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Best Decant Deals</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Handpicked fragrances from the world&apos;s most prestigious niche houses, delivered fresh in premium travel atomizers.
            </p>
          </div>
          <ProductGrid products={allProducts} />
          <div className="text-center mt-12">
            <Link href="/shop" className="btn-glass-light text-lg px-8 py-3 inline-block">
              Explore All Fragrances
            </Link>
          </div>
        </section>

        {/* Premium Features */}
        <section className="bg-gradient-to-r from-burgundy-50 to-accent/10 py-16 my-16">
          <div className="container-fluid">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-burgundy-900 mb-4">Why Choose TenML?</h2>
              <p className="text-burgundy-700 text-lg">Premium quality, authentic fragrances, exceptional service</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card p-8 text-center hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-4">🔐</div>
                <h3 className="text-xl font-bold text-burgundy-900 mb-2">100% Authentic</h3>
                <p className="text-gray-600">Decants directly from authentic bottles with premium imported atomizers</p>
              </div>
              
              <div className="card p-8 text-center hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-burgundy-900 mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Shipped within 24 hours with secure packaging throughout Bangladesh</p>
              </div>
              
              <div className="card p-8 text-center hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-burgundy-900 mb-2">24/7 Support</h3>
                <p className="text-gray-600">Round-the-clock customer support via WhatsApp and email</p>
              </div>
              
              <div className="card p-8 text-center hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-4">🌟</div>
                <h3 className="text-xl font-bold text-burgundy-900 mb-2">Best Prices</h3>
                <p className="text-gray-600">Competitive pricing with exclusive deals and promo codes</p>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Story Section */}
        <section className="container-fluid py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold text-burgundy-900 mb-6">Our Journey</h2>
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                TenML Perfume was born from a passion for fragrance. We believe that luxury and premium experiences should be accessible to everyone.
              </p>
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                Each decant is carefully prepared from 100% authentic bottles, bringing you the most exclusive fragrances from the world&apos;s finest niche houses.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                We&apos;re committed to delivering not just fragrances, but memories—timeless scents that become part of your signature.
              </p>
            </div>
            <div className="bg-gradient-to-br from-burgundy-100 to-accent/20 rounded-lg p-8 text-center">
              <div className="text-7xl mb-4">🎯</div>
              <h3 className="text-3xl font-bold text-burgundy-900 mb-4">Our Mission</h3>
              <p className="text-burgundy-700 text-lg">
                To make premium fragrances accessible, authentic, and delivered with excellence.
              </p>
            </div>
          </div>
        </section>

        {/* Newsletter - Premium */}
        <section className="bg-gradient-to-r from-burgundy-700 via-burgundy-800 to-burgundy-900 text-white py-16 my-16 rounded-2xl mx-4">
          <div className="container-fluid text-center">
            <h2 className="text-4xl font-bold mb-4">Stay in the Scent Loop</h2>
            <p className="text-lg text-burgundy-100 mb-8 max-w-2xl mx-auto">
              Subscribe to get exclusive deals, new fragrance launches, and insider tips delivered to your inbox.
            </p>
            <div className="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button className="btn-glass text-white font-bold px-6 py-3">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
