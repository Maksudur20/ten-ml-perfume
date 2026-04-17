'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useState } from 'react'
import { Mail, Phone, MapPin, Facebook } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-blue-600 text-white py-12">
          <div className="container-fluid text-center">
            <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
            <p className="text-blue-100 mt-2">We&apos;d love to hear from you</p>
          </div>
        </div>

        <div className="container-fluid py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Contact Info */}
            <div className="card p-6 text-center">
              <Phone className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">+880 1580-310965</p>
              <p className="text-gray-500 text-sm">Available 24/7</p>
            </div>

            <div className="card p-6 text-center">
              <Mail className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">info@tenml.com</p>
              <p className="text-gray-500 text-sm">Response within 2 hours</p>
            </div>

            <div className="card p-6 text-center">
              <MapPin className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">Dhaka, Bangladesh</p>
              <p className="text-gray-500 text-sm">Open 10am - 10pm</p>
            </div>

            <div className="card p-6 text-center">
              <Facebook className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Follow Us</h3>
              <a
                href="https://www.facebook.com/profile.php?id=61577853722167"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                10ML Perfume
              </a>
              <p className="text-gray-500 text-sm mt-2">Connect on Facebook</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">✓</div>
                  <p className="text-green-700 font-semibold">
                    Thank you! Your message has been sent successfully.
                  </p>
                  <p className="text-green-600 text-sm mt-2">
                    We&apos;ll get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <button type="submit" className="w-full btn-primary py-3 text-lg">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

          </div>
      </main>

      <Footer />
    </div>
  )
}
