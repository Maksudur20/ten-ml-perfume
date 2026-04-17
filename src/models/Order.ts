import mongoose, { Document, Schema } from 'mongoose'

export interface IOrder extends Document {
  userId: string // Reference to User
  trackingCode: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  items: Array<{
    id: string
    name: string
    brand?: string
    price: number
    size: string
    quantity: number
  }>
  subtotal: number
  discount: number
  deliveryCharge: number
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: String,
      required: false, // Allow guest checkout
      index: true,
    },
    trackingCode: {
      type: String,
      required: [true, 'Tracking code is required'],
      unique: true,
      uppercase: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [50, 'Customer name cannot exceed 50 characters'],
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      lowercase: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true,
    },
    customerAddress: {
      type: String,
      required: [true, 'Customer address is required'],
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters'],
    },
    customerCity: {
      type: String,
      required: [true, 'Customer city is required'],
      trim: true,
      maxlength: [50, 'City cannot exceed 50 characters'],
    },
    items: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        brand: String,
        price: { type: Number, required: true, min: 0 },
        size: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: [true, 'Total is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
)

// Index for tracking by userId
OrderSchema.index({ userId: 1, createdAt: -1 })
// Index for tracking by email
OrderSchema.index({ customerEmail: 1 })
// Index for tracking by tracking code
OrderSchema.index({ trackingCode: 1 })

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)
