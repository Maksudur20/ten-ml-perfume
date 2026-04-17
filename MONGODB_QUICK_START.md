# MongoDB + Vercel Setup Checklist

## ✅ What I've Already Done

- ✅ Created `src/lib/mongodb.ts` - MongoDB connection file
- ✅ Created `src/app/api/test-db/route.ts` - Connection test endpoint
- ✅ Created `src/app/api/db/products/route.ts` - Products CRUD API
- ✅ Created `src/app/api/db/orders/route.ts` - Orders API
- ✅ Created `src/app/api/db/reviews/route.ts` - Reviews API
- ✅ Installed `mongodb` npm package
- ✅ Created `.env.local.example` template

## 📋 Your Next Steps

### Step 1️⃣: Create MongoDB Atlas Account (5 min)
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free tier available)
3. Create a new organization and project
4. Create a **M0 Sandbox** cluster (free)
5. Choose AWS region closest to your users

### Step 2️⃣: Create Database User (2 min)
1. In MongoDB Atlas dashboard
2. Click **Database Access** → **Add New Database User**
3. Choose **Password** authentication
4. Username: `admin`
5. Generate a strong password
6. Default Role: **Atlas admin**
7. Click **Add User**

### Step 3️⃣: Set Network Access (1 min)
1. Click **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** (0.0.0.0/0)
3. Click **Confirm**

### Step 4️⃣: Get Connection String (2 min)
1. Go to **Databases**
2. Click **Connect** on your cluster
3. Choose **Drivers** → **Node.js**
4. Copy the connection string:
   ```
   mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace `PASSWORD`** with your actual password (from Step 2)

### Step 5️⃣: Add Environment Variable Locally (1 min)
1. Open `.env.local` in your project (create if doesn't exist)
2. Add:
   ```
   MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@your-cluster.mongodb.net/?retryWrites=true&w=majority
   ```
3. Replace `YOUR_PASSWORD` and cluster name with your values

### Step 6️⃣: Test Connection Locally (1 min)
1. Open terminal in VS Code
2. Run: `npm run dev`
3. Go to: http://localhost:3001/api/test-db
4. You should see:
   ```json
   {
     "status": "success",
     "message": "Connected to MongoDB successfully!"
   }
   ```

### Step 7️⃣: Add Environment Variable to Vercel (3 min)
1. Go to: https://vercel.com
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. **Name:** `MONGODB_URI`
6. **Value:** (your full connection string from Step 4)
7. Check boxes for: Production, Preview, Development
8. Click **Save**

### Step 8️⃣: Deploy to Vercel (2 min)
1. In your local terminal:
   ```bash
   git add .
   git commit -m "Add MongoDB integration with Vercel"
   git push
   ```
2. Vercel will auto-deploy
3. Go to your Vercel dashboard → your project
4. Wait for deployment to complete (green checkmark)

### Step 9️⃣: Test Production Connection (1 min)
1. Once deployed, visit:
   ```
   https://your-project.vercel.app/api/test-db
   ```
2. Should show the same success message

## 🧪 Test API Endpoints

After connecting, test these endpoints:

**Products:**
- GET: `/api/db/products`
- GET: `/api/db/products?category=men&isHot=true`
- POST: `/api/db/products` (with product data)

**Orders:**
- GET: `/api/db/orders`
- GET: `/api/db/orders?status=pending`
- POST: `/api/db/orders` (with order data)

**Reviews:**
- GET: `/api/db/reviews?productId=123`
- POST: `/api/db/reviews` (with review data)

## 📊 MongoDB Collections

After first use, MongoDB will create these automatically:
```
perfume_store (database)
├── products (admin products)
├── orders (customer orders)
├── reviews (product reviews)
└── test-db (test data)
```

## ⚡ Quick Commands

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Deploy to Vercel
git push

# View Vercel logs
vercel logs --follow
```

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid/Missing environment variable: MONGODB_URI" | Add `MONGODB_URI` to `.env.local` (locally) and Vercel (production) |
| Connection timeout | Ensure IP 0.0.0.0/0 is added in MongoDB Network Access |
| 403 Forbidden | Check username and password in connection string |
| Empty response from `/api/test-db` | Restart dev server: `npm run dev` |
| Deployment fails | Check Vercel logs: `vercel logs --follow` |

## 📚 Next Steps After Setup

Once connected, you can:
1. Replace localStorage with MongoDB for admin products
2. Permanently store customer orders
3. Save product reviews
4. Track user sessions
5. Implement user authentication

See `MONGODB_SETUP.md` for detailed examples!

## 🔗 Useful Links

- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Vercel Dashboard: https://vercel.com/dashboard
- MongoDB Docs: https://docs.mongodb.com/
- Driver API: https://www.mongodb.com/docs/drivers/node/
