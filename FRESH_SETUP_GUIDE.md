# Fresh Setup Guide - 10ml Perfume Store

This guide will help you set up the project from scratch with new MongoDB and Cloudinary instances.

## ✅ Completed Setup Steps

- ✅ Deleted old node_modules and package-lock.json
- ✅ Updated package.json with required dependencies
- ✅ Created new .env and .env.example files
- ✅ Installed all npm dependencies
- ✅ Created Cloudinary configuration (src/lib/cloudinary.ts)
- ✅ Created Mongoose configuration (src/lib/mongoose.ts)
- ✅ Updated MongoDB test route

## 📋 Next Steps

### 1. Configure Environment Variables

Edit `.env` file in the root directory with your actual credentials:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/perfume_store

# Server Port
PORT=5000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend/Backend URLs
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### 2. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier is fine)
3. Create a database user and get the connection string
4. Add your IP address to the IP whitelist
5. Copy the connection string and update `MONGODB_URI` in .env

### 3. Set Up Cloudinary

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copy your Cloud Name, API Key, and API Secret
3. Update these values in your .env file

### 4. Test Local Development

Run the development server:

```bash
npm run dev
```

Test MongoDB connection:

```bash
curl http://localhost:3000/api/test-db
```

Expected response:
```json
{
  "status": "success",
  "message": "Connected to MongoDB successfully!",
  "database": "perfume_store",
  "collections": 0,
  "dataSize": 0,
  "timestamp": "2024-04-17T10:00:00.000Z"
}
```

## 🚀 Deployment Instructions

### Backend Deployment (Render.com)

1. **Create Render Account**
   - Go to [Render](https://render.com)
   - Sign up and connect your GitHub

2. **Create New Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository
   - Select the repository and branch

3. **Configure Service**
   - Name: `ten-ml-perfume-api`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. **Add Environment Variables**
   - Click "Environment"
   - Add all variables from `.env`:
     - `MONGODB_URI`
     - `PORT=5000`
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`
     - `NODE_ENV=production`

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your backend URL will be: `https://your-service-name.onrender.com`

**Important**: Save your backend URL. You'll need it for frontend deployment.

### Frontend Deployment (Vercel)

1. **Import Project**
   - Go to [Vercel](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository

2. **Configure Project**
   - Framework Preset: `Next.js`
   - Root Directory: `./` (or where package.json is)

3. **Add Environment Variables**
   - `NEXT_PUBLIC_BACKEND_URL=https://your-service-name.onrender.com`
   - `NEXT_PUBLIC_API_URL=https://your-project.vercel.app`

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your frontend URL will appear

## 🧪 Final Verification Checklist

- [ ] `.env` file created with all values
- [ ] MongoDB Atlas cluster created and connection string added
- [ ] Cloudinary account created with credentials in `.env`
- [ ] `npm run dev` runs without errors
- [ ] MongoDB test endpoint returns success: `http://localhost:3000/api/test-db`
- [ ] Backend deployed to Render.com
- [ ] Frontend deployed to Vercel
- [ ] Frontend can communicate with backend API
- [ ] Image uploads work with Cloudinary

## 🔗 Important Endpoints

### Local Development
- Frontend: `http://localhost:3000`
- API Test DB: `http://localhost:3000/api/test-db`

### Production
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-service-name.onrender.com`

## 📝 Useful Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## ⚠️ Troubleshooting

### MongoDB Connection Error
- Check MONGODB_URI is correct in .env
- Verify IP address is whitelisted in MongoDB Atlas
- Make sure database user has correct password

### Cloudinary Upload Error
- Verify API credentials are correct
- Check file size doesn't exceed 10MB
- Allowed formats: jpg, jpeg, png, gif, webp, avif

### Backend Not Connecting
- Verify MONGODB_URI environment variable is set in Render
- Check Render logs for errors
- Ensure backend URL is correct in frontend .env

## 📞 Need Help?

Refer to official documentation:
- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
