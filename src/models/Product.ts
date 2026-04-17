import mongoose, { Document, Schema } from 'mongoose'

export interface IProduct extends Document {
  name: string
  brand: string
  category: 'men' | 'women' | 'unisex'
  price: number
  description: string
  image: string
  volume: number
  stock: number
  rating: number
  reviews: number
  createdAt: Date
  updatedAt: Date
  cloudinaryPublicId?: string
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      maxlength: [100, 'Product name cannot be more than 100 characters'],
    },
    brand: {
      type: String,
      required: [true, 'Please provide a brand name'],
      maxlength: [50, 'Brand name cannot be more than 50 characters'],
    },
    category: {
      type: String,
      enum: ['men', 'women', 'unisex'],
      required: [true, 'Please select a category'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    cloudinaryPublicId: {
      type: String,
      default: null,
    },
    volume: {
      type: Number,
      default: 10,
      description: 'Volume in ml',
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    reviews: {
      type: Number,
      default: 0,
      min: [0, 'Reviews cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
)

const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)

export default Product
