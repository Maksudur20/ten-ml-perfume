import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import Order from '@/models/Order'
import { generateInvoicePDF } from '@/lib/invoiceGenerator'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
      await connectDB()

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      )
    }

    // Generate PDF
    const doc = generateInvoicePDF(order)
    const pdfData = doc.output('arraybuffer')

    // Return PDF as download
    return new NextResponse(pdfData, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice-${order.trackingCode}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error('Generate invoice error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
