# 10ML Perfume - E-Commerce Platform

A modern, fast, and interactive e-commerce platform for premium 10ml perfume decants built with Next.js, React, and Tailwind CSS.

## Features

✨ **Dynamic & Interactive**
- Real-time shopping cart with persistent storage
- Instant product filtering and sorting
- Smooth animations and transitions
- Interactive product cards with hover effects

🚀 **Performance Optimized**
- Server-side rendering with Next.js
- Optimized bundle size
- Fast page transitions
- Responsive design for all devices

📱 **Multi-Page Application**
- Home page with featured deals
- Product shop with filtering
- Category pages (Men, Women, Unisex)
- Product detail pages
- Shopping cart management
- About page
- Contact page with form
- FAQ section

🛒 **E-Commerce Features**
- Add to cart functionality
- Quantity management
- Promo code support
- Order summary
- Responsive product grid
- Size selection

## Tech Stack

- **Framework**: Next.js 14
- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd ten-ml-perfume
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── shop/              # Shop page
│   ├── men/               # Men's category
│   ├── women/             # Women's category
│   ├── unisex/            # Unisex category
│   ├── product/[id]/      # Product detail page
│   ├── cart/              # Shopping cart
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── layout.tsx         # Root layout with providers
│   ├── globals.css        # Global styles
│
├── components/            # Reusable components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Footer
│   ├── ProductCard.tsx    # Product card component
│   ├── ProductGrid.tsx    # Product grid layout
│
├── context/               # React context
│   ├── CartContext.tsx    # Cart state management
│
├── data/                  # Static data
│   ├── products.ts        # Product database
│
└── public/               # Static assets

```

## Key Components

### Cart Context
- Global state management for shopping cart
- Persistent localStorage support
- Add, remove, update quantity operations

### ProductCard
- Interactive product display
- Wishlist toggle
- Quick view overlay
- Size selection

### Header
- Sticky navigation
- Search functionality
- Cart counter badge
- Mobile responsive menu

## Features Implementation

### 1. Dynamic Product Filtering
- Filter by category (Men, Women, Unisex)
- Sort by price, newest
- Real-time updates

### 2. Interactive Shopping Cart
- Add/remove items
- Update quantities
- Promo code support (SAVE10, SAVE20)
- Persistent storage

### 3. Product Details
- Full product information
- Multiple size options
- Quantity selector
- Add to cart with instant feedback

### 4. Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Smooth animations

## Promo Codes

Test these promo codes in the cart:
- `SAVE10` - 10% discount
- `SAVE20` - 20% discount

## Performance Metrics

- ⚡ Fast initial load time
- 📊 Optimized bundle size
- 🎯 Smooth interactions (60 FPS)
- 📱 Mobile optimized

## Future Enhancements

- [ ] User authentication
- [ ] Order tracking
- [ ] Payment gateway integration
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Advanced search and filters

## API Integration Ready

The app is structured to easily integrate with:
- RESTful APIs
- GraphQL endpoints
- CMS systems
- Payment gateways

## Customization

### Adding New Products

Edit `src/data/products.ts`:
```typescript
export const products: Product[] = [
  {
    id: 'product-id',
    name: 'Product Name',
    brand: 'Brand Name',
    category: 'men' | 'women' | 'unisex',
    price: { min: 100, max: 500 },
    image: '/path-to-image.jpg',
    description: 'Product description',
    notes: ['note1', 'note2'],
    isHot: true,
    sizes: ['3ml', '5ml', '9ml'],
  },
]
```

### Styling

Tailwind CSS is pre-configured. Customize in `tailwind.config.js`.

## License

All rights reserved.
