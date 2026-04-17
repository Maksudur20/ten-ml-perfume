# MongoDB + Vercel Setup Guide

## Step 1: Create MongoDB Atlas Account & Cluster

1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
2. **Sign up for free** (creates a free tier cluster)
3. **Create Organization** → Create Project
4. **Create a Cluster**:
   - Choose "M0 Sandbox" (free tier)
   - Cloud Provider: AWS
   - Region: Choose closest to your users
   - Click "Create"

## Step 2: Set Up Security & Connection

1. **Create Database User**:
   - Click "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Username: `admin` (or your choice)
   - Password: Generate a strong one
   - Default Role: "Atlas admin"
   - Click "Add User"

2. **Set Network Access**:
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

## Step 3: Get Connection String

1. Go to "Databases" → Click "Connect" on your cluster
2. Choose "Drivers" → "Node.js"
3. Copy the connection string (looks like):
   ```
   mongodb+srv://admin:PASSWORD@cluster-name.mongodb.net/?retryWrites=true&w=majority
   ```
4. **Replace `PASSWORD`** with your actual password

## Step 4: Add Environment Variables to Vercel

1. **Go to your Vercel Dashboard**:
   - Select your project
   - Go to "Settings" → "Environment Variables"

2. **Add these variables**:
   ```
   MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster-name.mongodb.net/?retryWrites=true&w=majority
   ```

3. **Check the boxes** for: Production, Preview, Development
4. Click "Save"

## Step 5: Install MongoDB Driver

In your project terminal:
```bash
npm install mongodb
```

Or if using Mongoose for easier data modeling:
```bash
npm install mongoose
```

## Step 6: Create MongoDB Connection File

Create `src/lib/mongodb.ts`:
```typescript
import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so we don't lose the connection
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
```

## Step 7: Create API Route to Test Connection

Create `src/app/api/test-db/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('perfume_store')

    // Test connection
    const adminDb = db.admin()
    await adminDb.ping()

    return NextResponse.json({
      status: 'success',
      message: 'Connected to MongoDB',
      database: db.databaseName,
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: String(error) },
      { status: 500 }
    )
  }
}
```

## Step 8: Deploy to Vercel

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Add MongoDB integration"
   git push
   ```

2. Vercel will automatically redeploy with the new environment variables

## Step 9: Migrate Data to MongoDB

Now you can update your contexts to use MongoDB instead of localStorage:

**Example for products** (update `src/context/AdminContext.tsx`):
```typescript
// Add API call to save products to MongoDB
const saveProductsToMongoDB = async (products: AdminProduct[]) => {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products }),
    })
    return response.json()
  } catch (error) {
    console.error('Failed to save to MongoDB:', error)
  }
}
```

## Step 10: Test the Connection

1. **Locally**: Run `npm run dev` and visit `http://localhost:3001/api/test-db`
2. **On Vercel**: Visit `https://your-project.vercel.app/api/test-db`

Both should return: `{ status: 'success', message: 'Connected to MongoDB' }`

---

## Collections to Create

Organize your data into these MongoDB collections:

```
perfume_store (database)
├── products (admin products)
├── orders (customer orders)
├── reviews (product reviews)
├── carts (abandoned carts)
└── users (optional - customer profiles)
```

## Next Steps

Once connected, you can:
1. Create API routes for CRUD operations
2. Update contexts to fetch from MongoDB
3. Store admin products permanently in the database
4. Track customer orders and reviews
5. Persist user sessions and preferences
