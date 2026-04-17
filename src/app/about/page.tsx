'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-blue-600 text-white py-12">
          <div className="container-fluid text-center">
            <h1 className="text-4xl md:text-5xl font-bold">About 10ML Perfume</h1>
          </div>
        </div>

        <div className="container-fluid py-12">
          <div className="max-w-3xl mx-auto">
            {/* Our Story */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                10ML Perfume was founded with a simple mission: to make premium fragrances
                accessible to everyone. We believe that luxury doesn&apos;t have to break the bank.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our carefully curated collection of 10ml decants brings you the world&apos;s finest
                perfumes at affordable prices. Each decant is prepared fresh from authentic
                bottles, ensuring you get the genuine experience of these exclusive fragrances.
              </p>
            </section>

            {/* Why Choose Us */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Us?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card p-6">
                  <div className="text-4xl mb-3">✓</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">100% Authentic</h3>
                  <p className="text-gray-600">
                    All our decants are made from 100% authentic perfume bottles. No fakes, no
                    dilutions, no compromises.
                  </p>
                </div>
                <div className="card p-6">
                  <div className="text-4xl mb-3">🏆</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Selection</h3>
                  <p className="text-gray-600">
                    Our team of fragrance experts carefully selects each perfume in our
                    collection.
                  </p>
                </div>
                <div className="card p-6">
                  <div className="text-4xl mb-3">🚚</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Shipping</h3>
                  <p className="text-gray-600">
                    We ship within 24 hours of order confirmation. Get your fragrances quickly,
                    safely packaged.
                  </p>
                </div>
                <div className="card p-6">
                  <div className="text-4xl mb-3">💬</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Support</h3>
                  <p className="text-gray-600">
                    Our customer support team is always available to help you via WhatsApp and
                    email.
                  </p>
                </div>
              </div>
            </section>

            {/* Our Team */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                We&apos;re passionate about fragrance and believe everyone deserves access to quality
                perfumes. Our mission is to provide an easier, more affordable way to explore the
                world&apos;s finest scents.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Whether you&apos;re looking for a signature scent, want to try something new, or are a
                fragrance enthusiast, 10ML Perfume is your go-to destination for authentic,
                high-quality decants.
              </p>
            </section>

            {/* Stats */}
            <section className="bg-blue-50 rounded-lg p-8 grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600">2000+</div>
                <p className="text-gray-600">Happy Customers</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600">100+</div>
                <p className="text-gray-600">Premium Fragrances</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600">24h</div>
                <p className="text-gray-600">Fast Delivery</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
