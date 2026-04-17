'use client'

import { Order } from '@/context/OrderContext'
import { useState } from 'react'
import { Eye, X } from 'lucide-react'

interface InvoiceViewerProps {
  order: Order
}

export function InvoiceViewer({ order }: InvoiceViewerProps) {
  const [isOpen, setIsOpen] = useState(false)

  void order

  // This component is kept for backward compatibility
  // Invoice generation has been replaced with tracking codes
  
  return (
    <>
      {/* View Button - Disabled */}
      <button
        disabled
        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
        title="Invoice generation has been replaced with tracking codes"
      >
        <Eye size={16} />
        <span className="text-sm">Invoice Viewer (Deprecated)</span>
      </button>

      {/* Modal - Not shown */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Invoice System Deprecated</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-600">
              Invoice generation has been replaced with a simpler order tracking system. 
              You can track your order using the tracking code displayed after purchase.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
