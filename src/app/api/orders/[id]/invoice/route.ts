import { NextRequest, NextResponse } from 'next/server'
import { connect } from '@/src/lib/mongoose'
import Order from '@/src/models/Order'
import { generateInvoicePDF } from '@/src/lib/invoiceGenerator'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect()

    const order = await Order.findById(params.id)

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
