import jsPDF from 'jspdf'
import { IOrder } from '@/models/Order'

export interface InvoiceOptions {
  companyName?: string
  companyEmail?: string
  companyPhone?: string
  companyAddress?: string
  companyLogo?: string
}

const defaultOptions: InvoiceOptions = {
  companyName: 'TEN ML PERFUME',
  companyEmail: 'info@tenmlperfume.com',
  companyPhone: '+880-1234-567890',
  companyAddress: 'Dhaka, Bangladesh',
}

export function generateInvoicePDF(
  order: IOrder,
  options: InvoiceOptions = {}
): jsPDF {
  const config = { ...defaultOptions, ...options }
  const doc = new jsPDF()

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 10
  let yPosition = margin

  // Colors
  const primaryColor = [0, 102, 204] // Blue
  const headerBgColor = [240, 245, 250]
  const borderColor = [200, 200, 200]
  const darkText = [33, 33, 33]

  // Header
  doc.setFillColor(...headerBgColor)
  doc.rect(0, 0, pageWidth, 40, 'F')

  // Company Info
  doc.setTextColor(...primaryColor)
  doc.setFontSize(24)
  doc.setFont(undefined, 'bold')
  doc.text(config.companyName || 'TEN ML PERFUME', margin, yPosition + 10)

  doc.setFontSize(9)
  doc.setFont(undefined, 'normal')
  doc.setTextColor(...darkText)
  yPosition = 40 + margin

  const contactInfo = [
    `Email: ${config.companyEmail}`,
    `Phone: ${config.companyPhone}`,
    `Address: ${config.companyAddress}`,
  ]

  contactInfo.forEach((info) => {
    doc.text(info, margin, yPosition)
    yPosition += 4
  })

  yPosition += 4

  // Invoice Title and Details
  doc.setFontSize(14)
  doc.setFont(undefined, 'bold')
  doc.text('INVOICE', margin, yPosition)

  yPosition += 8

  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')

  const invoiceDetails = [
    `Invoice #: ${order._id}`,
    `Tracking Code: ${order.trackingCode}`,
    `Date: ${new Date(order.createdAt).toLocaleDateString('en-BD')}`,
    `Status: ${order.status.toUpperCase()}`,
  ]

  invoiceDetails.forEach((detail) => {
    doc.text(detail, margin, yPosition)
    yPosition += 5
  })

  yPosition += 8

  // Bill To Section
  doc.setFont(undefined, 'bold')
  doc.setFontSize(10)
  doc.text('BILL TO:', margin, yPosition)
  yPosition += 5

  doc.setFont(undefined, 'normal')
  doc.setFontSize(9)
  const billToInfo = [
    order.customerName,
    order.customerEmail,
    order.customerPhone,
    order.customerAddress,
    order.customerCity,
  ]

  billToInfo.forEach((info) => {
    doc.text(info, margin, yPosition)
    yPosition += 4
  })

  yPosition += 6

  // Table Header
  const startX = margin
  const col1X = margin
  const col2X = margin + 80
  const col3X = margin + 120
  const col4X = margin + 150

  doc.setFillColor(...primaryColor)
  doc.setTextColor(255, 255, 255)
  doc.setFont(undefined, 'bold')
  doc.setFontSize(10)

  const tableTop = yPosition
  doc.rect(startX, tableTop, pageWidth - 2 * margin, 8, 'F')

  doc.text('Product', col1X + 2, yPosition + 6)
  doc.text('Size', col2X + 2, yPosition + 6)
  doc.text('Qty', col3X + 2, yPosition + 6)
  doc.text('Price', col4X + 2, yPosition + 6)

  yPosition += 10

  // Table Content
  doc.setTextColor(...darkText)
  doc.setFont(undefined, 'normal')
  doc.setFontSize(9)

  order.items.forEach((item) => {
    const itemTotal = item.price * item.quantity
    doc.text(item.name.substring(0, 30), col1X + 2, yPosition)
    doc.text(item.size, col2X + 2, yPosition)
    doc.text(item.quantity.toString(), col3X + 2, yPosition)
    doc.text(`৳${itemTotal.toFixed(2)}`, col4X + 2, yPosition, { align: 'right' })
    yPosition += 5
  })

  yPosition += 3

  // Summary Section
  const summaryX = pageWidth - margin - 50

  doc.setFont(undefined, 'normal')
  doc.setFontSize(9)

  doc.text('Subtotal:', summaryX, yPosition)
  doc.text(`৳${order.subtotal.toFixed(2)}`, pageWidth - margin, yPosition, {
    align: 'right',
  })
  yPosition += 5

  if (order.discount > 0) {
    doc.text('Discount:', summaryX, yPosition)
    doc.text(`-৳${order.discount.toFixed(2)}`, pageWidth - margin, yPosition, {
      align: 'right',
    })
    yPosition += 5
  }

  if (order.deliveryCharge > 0) {
    doc.text('Delivery:', summaryX, yPosition)
    doc.text(`৳${order.deliveryCharge.toFixed(2)}`, pageWidth - margin, yPosition, {
      align: 'right',
    })
    yPosition += 5
  }

  doc.setFont(undefined, 'bold')
  doc.setFontSize(10)
  doc.text('TOTAL:', summaryX, yPosition)
  doc.text(`৳${order.total.toFixed(2)}`, pageWidth - margin, yPosition, {
    align: 'right',
  })

  // Footer
  yPosition = pageHeight - 30
  doc.setFontSize(8)
  doc.setFont(undefined, 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text('Thank you for your purchase!', margin, yPosition)
  doc.text(
    'For inquiries, please contact us at ' + config.companyEmail,
    margin,
    yPosition + 4
  )

  // Page number
  doc.setFontSize(8)
  doc.text(
    `Generated on ${new Date().toLocaleString('en-BD')}`,
    margin,
    pageHeight - 10
  )

  return doc
}

export function downloadInvoicePDF(order: IOrder, fileName?: string): void {
  const doc = generateInvoicePDF(order)
  const finalFileName = fileName || `Invoice-${order.trackingCode}.pdf`
  doc.save(finalFileName)
}

export async function generateInvoicePDFAsBlob(order: IOrder): Promise<Blob> {
  const doc = generateInvoicePDF(order)
  const pdfData = doc.output('arraybuffer')
  return new Blob([pdfData], { type: 'application/pdf' })
}
