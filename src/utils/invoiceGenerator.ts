import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export interface InvoiceData {
  orderId: string
  orderDate: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  items: Array<{
    name: string
    size: string
    quantity: number
    price: number
  }>
  subtotal: number
  discount: number
  total: number
  status: string
}

export const generateInvoiceHTML = (data: InvoiceData): string => {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.size}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">৳${item.price.toLocaleString('en-BD')}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">৳${(item.price * item.quantity).toLocaleString('en-BD')}</td>
    </tr>
  `
    )
    .join('')

  const discountRow = data.discount > 0 ? `<div class="total-row">
            <span>Discount:</span>
            <span>-৳${data.discount.toLocaleString('en-BD')}</span>
          </div>` : ''

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Arial', sans-serif;
          background: white;
          color: #333;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 40px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
        }
        .company-info h1 {
          margin: 0 0 10px 0;
          font-size: 28px;
          color: #2563eb;
          font-weight: bold;
        }
        .company-info p {
          margin: 3px 0;
          color: #666;
          font-size: 12px;
        }
        .invoice-details {
          text-align: right;
        }
        .invoice-title {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 5px;
        }
        .invoice-meta {
          color: #666;
          font-size: 13px;
          line-height: 1.6;
        }
        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: bold;
          margin-top: 10px;
          text-transform: uppercase;
        }
        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }
        .status-confirmed {
          background: #dbeafe;
          color: #1e40af;
        }
        .status-shipped {
          background: #e9d5ff;
          color: #6b21a8;
        }
        .status-delivered {
          background: #dcfce7;
          color: #166534;
        }
        .details-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 30px;
        }
        .detail-box h3 {
          margin: 0 0 12px 0;
          font-size: 11px;
          font-weight: bold;
          color: #1f2937;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .detail-box p {
          margin: 4px 0;
          font-size: 13px;
          color: #374151;
          line-height: 1.5;
        }
        .detail-box strong {
          font-weight: 600;
        }
        .items-table {
          width: 100%;
          margin: 30px 0;
          border-collapse: collapse;
          background: white;
        }
        .items-table thead {
          background: #f9fafb;
        }
        .items-table th {
          padding: 12px;
          text-align: left;
          font-weight: 600;
          font-size: 12px;
          color: #1f2937;
          border-bottom: 2px solid #e5e7eb;
        }
        .items-table td {
          padding: 12px;
          font-size: 13px;
          border-bottom: 1px solid #e5e7eb;
        }
        .items-table tbody tr:last-child td {
          border-bottom: 2px solid #e5e7eb;
        }
        .text-right {
          text-align: right;
        }
        .text-center {
          text-align: center;
        }
        .totals-section {
          margin-top: 30px;
          margin-left: auto;
          width: 350px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 13px;
          border-bottom: 1px solid #e5e7eb;
        }
        .total-row.subtotal {
          color: #666;
        }
        .total-row.final {
          padding: 12px 0;
          font-size: 16px;
          font-weight: bold;
          color: #2563eb;
          border-bottom: none;
          border-top: 2px solid #2563eb;
          margin-top: 10px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          font-size: 11px;
          color: #666;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="company-info">
            <h1>10ML PERFUME</h1>
            <p><strong>Phone:</strong> +880 1580-310965</p>
            <p><strong>Email:</strong> info@10mlperfume.com</p>
            <p><strong>Address:</strong> Dhaka, Bangladesh</p>
          </div>
          <div class="invoice-details">
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-meta">
              <p><strong>Order ID:</strong> ${data.orderId}</p>
              <p><strong>Date:</strong> ${data.orderDate}</p>
              <p><strong>Status:</strong></p>
              <span class="status-badge status-${data.status.toLowerCase()}">
                ${data.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div class="details-section">
          <div class="detail-box">
            <h3>Bill To</h3>
            <p><strong>${data.customerName}</strong></p>
            <p>${data.customerAddress}</p>
            <p>${data.customerCity}</p>
            <p>Phone: ${data.customerPhone}</p>
            ${data.customerEmail ? `<p>Email: ${data.customerEmail}</p>` : ''}
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th class="text-center">Size</th>
              <th class="text-center">Qty</th>
              <th class="text-right">Unit Price</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <div class="totals-section">
          <div class="total-row subtotal">
            <span>Subtotal:</span>
            <span>৳${data.subtotal.toLocaleString('en-BD')}</span>
          </div>
          ${discountRow}
          <div class="total-row final">
            <span>Total Amount:</span>
            <span>৳${data.total.toLocaleString('en-BD')}</span>
          </div>
        </div>

        <div class="footer">
          <p><strong>Thank you for your purchase!</strong></p>
          <p>This is a computer-generated invoice. No signature required.</p>
          <p>For inquiries, contact us at +880 1580-310965 or info@10mlperfume.com</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export const generateInvoiceImage = async (data: InvoiceData): Promise<string> => {
  try {
    // Create container
    const container = document.createElement('div')
    container.innerHTML = generateInvoiceHTML(data)
    container.style.position = 'fixed'
    container.style.left = '-99999px'
    container.style.top = '-99999px'
    container.style.width = '800px'
    container.style.background = 'white'
    
    document.body.appendChild(container)

    // Wait for images to load
    await new Promise(resolve => setTimeout(resolve, 500))

    // Convert to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowHeight: container.scrollHeight,
      windowWidth: container.scrollWidth,
    })

    // Clean up
    document.body.removeChild(container)

    // Return as base64
    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('Error generating invoice image:', error)
    // Return a placeholder if generation fails
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  }
}

export const generateInvoicePDF = async (data: InvoiceData): Promise<string> => {
  try {
    // Create container
    const container = document.createElement('div')
    container.innerHTML = generateInvoiceHTML(data)
    container.style.position = 'fixed'
    container.style.left = '-99999px'
    container.style.top = '-99999px'
    container.style.width = '800px'
    container.style.background = 'white'
    
    document.body.appendChild(container)

    // Wait for images to load
    await new Promise(resolve => setTimeout(resolve, 500))

    // Convert to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowHeight: container.scrollHeight,
      windowWidth: container.scrollWidth,
    })

    // Clean up
    document.body.removeChild(container)

    // Create PDF
    const pdf = new jsPDF({
      format: 'a4',
      unit: 'mm',
      orientation: 'portrait',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pageWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    const imgData = canvas.toDataURL('image/png')

    // Add pages as needed
    while (heightLeft >= 0) {
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      position -= pageHeight
      if (heightLeft > 0) {
        pdf.addPage()
      }
    }

    return pdf.output('dataurlstring')
  } catch (error) {
    console.error('Error generating PDF:', error)
    // Return empty PDF if generation fails
    const emptyPDF = new jsPDF()
    emptyPDF.text('Invoice generation failed. Please use the image format.', 10, 10)
    return emptyPDF.output('dataurlstring')
  }
}
