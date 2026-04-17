import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import Product from '@/models/Product'

export const dynamic = 'force-dynamic'

// Sample products to seed the database
const sampleProducts = [
  {
    id: '1',
    name: 'Creed Aventus',
    brand: 'Creed',
    category: 'men' as const,
    price: { min: 350, max: 450 },
    image: 'https://res.cloudinary.com/ten-ml-perfumes/image/upload/v1/perfume_store/creed_aventus.jpg',
    description: 'A legendary fragrance with fruity and woody notes',
    notes: ['Pineapple', 'Birch', 'Musk', 'Ambroxan'],
    isHot: true,
    sizes: ['5ml', '10ml', '15ml'],
    variantPrices: { '5ml': 50, '10ml': 85, '15ml': 120 },
    inStock: true,
  },
  {
    id: '2',
    name: 'Dior Sauvage',
    brand: 'Dior',
    category: 'men' as const,
    price: { min: 80, max: 120 },
    image: 'https://res.cloudinary.com/ten-ml-perfumes/image/upload/v1/perfume_store/dior_sauvage.jpg',
    description: 'A fresh and spicy fragrance perfect for daily wear',
    notes: ['Ambroxan', 'Pepper', 'Ambrette Seed'],
    isHot: true,
    sizes: ['5ml', '10ml'],
    variantPrices: { '5ml': 15, '10ml': 25 },
    inStock: true,
  },
  {
    id: '3',
    name: 'Bleu de Chanel',
    brand: 'Chanel',
    category: 'men' as const,
    price: { min: 90, max: 130 },
    image: 'https://res.cloudinary.com/ten-ml-perfumes/image/upload/v1/perfume_store/bleu_de_chanel.jpg',
    description: 'An iconic blue fragrance with citrus and woody notes',
    notes: ['Lemon', 'Mint', 'Cedarwood', 'Sandalwood'],
    isHot: true,
    sizes: ['5ml', '10ml'],
    variantPrices: { '5ml': 18, '10ml': 30 },
    inStock: true,
  },
  {
    id: '4',
    name: 'Chanel No. 5',
    brand: 'Chanel',
    category: 'women' as const,
    price: { min: 100, max: 150 },
    image: 'https://res.cloudinary.com/ten-ml-perfumes/image/upload/v1/perfume_store/chanel_no5.jpg',
    description: 'The most iconic womens fragrance of all time',
    notes: ['Neroli', 'Jasmine', 'Rose', 'Sandalwood', 'Vanilla'],
    isHot: true,
    sizes: ['5ml', '10ml'],
    variantPrices: { '5ml': 20, '10ml': 35 },
    inStock: true,
  },
  {
    id: '5',
    name: 'Perfume Club De Nuit Intense',
    brand: 'Armaf',
    category: 'men' as const,
    price: { min: 40, max: 80 },
    image: 'https://res.cloudinary.com/ten-ml-perfumes/image/upload/v1/perfume_store/club_de_nuit.jpg',
    description: 'A premium alternative to Aventus',
    notes: ['Pineapple', 'Blackcurrant', 'Vanilla', 'Musk'],
    isHot: true,
    sizes: ['5ml', '10ml'],
    variantPrices: { '5ml': 12, '10ml': 20 },
    inStock: true,
  },
]

export async function POST() {
  try {
    await connectDB()

    // Check if products already exist
    const existingCount = await Product.countDocuments()
    if (existingCount > 0) {
      return NextResponse.json(
        {
          status: 'warning',
          message: `Database already has ${existingCount} products. Not seeding to avoid duplicates.`,
          count: existingCount,
        },
        { status: 200 }
      )
    }

    // Insert sample products
    const result = await Product.insertMany(sampleProducts)

    return NextResponse.json(
      {
        status: 'success',
        message: 'Database seeded successfully',
        count: result.length,
        products: result,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to seed database',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectDB()
    const count = await Product.countDocuments()

    return NextResponse.json({
      status: 'success',
      message: 'Database seeding status',
      productCount: count,
      seedAvailable: true,
      instruction: 'Send POST request to /api/seed to populate database with sample products',
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to check database',
      },
      { status: 500 }
    )
  }
}
