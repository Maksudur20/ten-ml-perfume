# 10ml Perfume Store - Complete Setup Guide

## 🎯 Your Project Configuration

**Project**: Premium 10ml Perfume Decants E-commerce Store
**Type**: Full-Stack (Next.js Frontend + Node.js Backend)
**Database**: MongoDB Atlas
**Storage**: Cloudinary
**Backend**: Render
**Frontend**: Vercel

---

## ✅ What's Been Set Up

### 1. Environment Configuration
- ✅ `.env` file created with your credentials
- ✅ MongoDB URI configured
- ✅ Cloudinary credentials added
- ✅ API base URL setup
- ✅ Environment variables documented in `.env.example`

### 2. Database
- ✅ MongoDB connection configured (Mongoose)
- ✅ Product model created with schema
- ✅ Database connection utility set up

### 3. Cloud Storage
- ✅ Cloudinary integration configured
- ✅ Image upload API route created (`/api/upload`)
- ✅ Multer configuration ready

### 4. API Routes
- ✅ Products endpoints: GET (list, filter) & POST (create)
- ✅ Image upload endpoint ready
- ✅ Database test endpoint
- ✅ API configuration helper

### 5. Deployment
- ✅ Render deployment guide
- ✅ Vercel deployment guide
- ✅ Environment variable templates

---

## 📋 Your Credentials Summary

| Service | Status | Details |
|---------|--------|---------|
| MongoDB | ✅ Ready | `cluster0.gnvmi5n.mongodb.net` |
| Cloudinary | ⚠️ Needs API Key | Cloud: `ten-ml-perfumes` |
| Render | 📝 Ready to Deploy | Not yet deployed |
| Vercel | 📝 Ready to Deploy | Not yet deployed |

---

## 🚀 Next Steps

### Step 1: Fix Cloudinary API Key

⚠️ **ACTION NEEDED**: The Cloudinary API Key needs to be corrected.

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console/settings/api-keys)
2. Copy your actual **API Key** (numeric value)
3. Open `.env` file
4. Replace `get_your_api_key_from_dashboard` with your actual key

Current `.env` for Cloudinary:
```env
CLOUDINARY_CLOUD_NAME=ten-ml-perfumes
CLOUDINARY_API_KEY=get_your_api_key_from_dashboard  ← UPDATE THIS
CLOUDINARY_API_SECRET=LFdMw_Ga1qaOz4i3Xqp9JpGXGTY
```

### Step 2: Test Locally

```bash
# Make sure you're in project directory
cd "g:\ten ml perfumes\ten-ml-perfume"

# Start development server
npm run dev

# Test MongoDB connection
curl http://localhost:3000/api/test-db

# Should return:
# {
#   "status": "success",
#   "message": "Connected to MongoDB successfully!",
#   "database": "perfume_store"
# }
```

### Step 3: Deploy Backend to Render

1. Push your code to GitHub
2. Follow [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)
3. Get your Render backend URL (e.g., `https://ten-ml-perfume-api.onrender.com`)

### Step 4: Deploy Frontend to Vercel

1. After Render deployment, follow [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
2. Update environment variables with:
   - `NEXT_PUBLIC_BACKEND_URL` = Your Render URL
   - `NEXT_PUBLIC_API_URL` = Your Vercel URL

### Step 5: Verify Everything Works

- [ ] Frontend loads on Vercel URL
- [ ] API calls respond (check Network tab in DevTools)
- [ ] Images upload to Cloudinary
- [ ] Products display correctly
- [ ] Database queries work

---

## 📁 Project Structure

```
ten-ml-perfume/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── upload/          ← Image upload to Cloudinary
│   │   │   ├── products/        ← Product CRUD operations
│   │   │   └── test-db/         ← MongoDB connection test
│   │   └── page.tsx             ← Homepage
│   ├── models/
│   │   └── Product.ts           ← MongoDB product schema
│   ├── lib/
│   │   ├── api-config.ts        ← API configuration & helpers
│   │   ├── cloudinary.ts        ← Cloudinary config
│   │   ├── mongoose.ts          ← MongoDB connection
│   │   └── mongodb.ts           ← Legacy MongoDB client
│   └── components/              ← React components
├── .env                         ← Your credentials (git ignored)
├── .env.example                 ← Template for team
├── package.json                 ← Dependencies
├── FRESH_SETUP_GUIDE.md        ← Initial setup reference
├── RENDER_DEPLOYMENT.md        ← Backend deployment steps
└── VERCEL_DEPLOYMENT.md        ← Frontend deployment steps
```

---

## 🔌 API Endpoints

### Local Development
```
GET  http://localhost:3000/api/products              ← List products
POST http://localhost:3000/api/products              ← Create product
POST http://localhost:3000/api/upload                ← Upload image
GET  http://localhost:3000/api/test-db               ← Test connection
```

### Production (after deployment)
```
GET  https://your-api.onrender.com/api/products
POST https://your-api.onrender.com/api/products
POST https://your-api.onrender.com/api/upload
GET  https://your-api.onrender.com/api/test-db
```

---

## 🧪 Testing Checklist

### Local Development
- [ ] `npm run dev` starts without errors
- [ ] http://localhost:3000 loads
- [ ] http://localhost:3000/api/test-db returns success
- [ ] Can view products
- [ ] Can upload image

### Production Deployment
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Frontend loads on Vercel URL
- [ ] API calls work from frontend
- [ ] Images display correctly
- [ ] No CORS errors

---

## ⚠️ Important Notes

### MongoDB
- Connection string uses your credentials
- Database name: `ten_ml_perfume`
- Collections created on first insert

### Cloudinary
- Folder: `perfume_store`
- Max file size: 10MB
- Allowed formats: jpg, jpeg, png, gif, webp, avif
- Files are public (URL-based access)

### Render (Backend)
- Free tier: Project spins down after 15 min idle
- First request takes 30-40 seconds to wake up
- Use Starter plan for always-on production
- Auto-deploys on GitHub push

### Vercel (Frontend)
- Automatic GitHub integration
- Free SSL/HTTPS included
- Automatic deployments on push
- Regional edge caching
- Analytics and monitoring available

---

## 📝 Environment Variables Guide

### MongoDB
- `MONGODB_URI`: Connection string from MongoDB Atlas
- Format: `mongodb+srv://username:password@cluster/database`

### Cloudinary
- `CLOUDINARY_CLOUD_NAME`: Your account cloud name
- `CLOUDINARY_API_KEY`: From API keys settings
- `CLOUDINARY_API_SECRET`: From API keys settings (keep private!)

### Deployment
- `NEXT_PUBLIC_BACKEND_URL`: Your Render backend URL
- `NEXT_PUBLIC_API_URL`: Your Vercel frontend URL
- `NODE_ENV`: development/production

⚠️ **Security Note**: Never commit `.env` to Git. Only commit `.env.example`.

---

## 🔗 Useful Commands

```bash
# Development
npm run dev              # Start dev server on port 3000
npm run build          # Build for production
npm run start          # Start production server
npm run lint           # Run ESLint

# Testing
curl http://localhost:3000/api/test-db    # Test MongoDB
curl http://localhost:3000/api/products   # Get all products
```

---

## 🆘 Troubleshooting

### MongoDB Connection Error
```
Error: MONGODB_URI not configured
```
**Solution**: Update `MONGODB_URI` in `.env` with correct connection string

### Cloudinary Upload Failed
```
Error: Cloudinary configuration incomplete
```
**Solution**: Verify all three Cloudinary env vars are set correctly

### API Returns 404
```
GET http://localhost:3000/api/products → 404
```
**Solution**: Make sure server is running with `npm run dev`

### Vercel Cannot Connect to Backend
```
Error: fetch failed / Access denied
```
**Solution**: Update `NEXT_PUBLIC_BACKEND_URL` in Vercel environment variables

---

## 📞 Support Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Mongoose Docs](https://mongoosejs.com/)

---

## ✨ You're All Set!

Your project is now configured for:
- ✅ MongoDB Atlas database
- ✅ Cloudinary image hosting
- ✅ Render backend deployment
- ✅ Vercel frontend deployment

**Next**: Fix the Cloudinary API Key, test locally, then deploy! 🚀
