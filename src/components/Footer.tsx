import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-burgundy-900 text-white mt-16">
      <div className="container-fluid py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <img src="/logo.svg" alt="10ML Logo" className="h-8 w-8" />
              <span>10ML Perfume</span>
            </h3>
            <p className="text-burgundy-200 text-sm">
              Your trusted source for 100% authentic perfume decants in 3ml, 5ml, 9ml, and larger sizes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-burgundy-200 text-sm">
              <li>
                <Link href="/" className="hover:text-accent transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-accent transition">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-4">Categories</h4>
            <ul className="space-y-2 text-burgundy-200 text-sm">
              <li>
                <Link href="/shop" className="hover:text-accent transition">
                  All Perfumes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <div className="space-y-3 text-burgundy-200 text-sm">
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+880 1869-151550</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>info@10mlperfume.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="mt-1" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <a
                href="https://web.whatsapp.com/send?phone=8801869151550&text=Hi%20I%20want%20to%20know%20about%20your%20perfumes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 btn-glass text-white px-4 py-2 mt-3"
              >
                <span>💬</span>
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-burgundy-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-burgundy-200 text-sm">
            <p>&copy; 2024 10ML Perfume. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-accent transition">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-accent transition">
                Terms & Conditions
              </Link>
              <Link href="#" className="hover:text-accent transition">
                Shipping Info
              </Link>
              <Link href="/admin/login" className="text-accent hover:text-opacity-80 transition">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
