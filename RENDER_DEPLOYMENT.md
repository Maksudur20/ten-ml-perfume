# Render Deployment Guide

## Prerequisites
- Push your code to GitHub
- Have Render account (render.com)

## Step-by-Step Deployment

### 1. Create New Web Service on Render

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" button
3. Select "Web Service"
4. Connect your GitHub repository
5. Select the repository and branch

### 2. Configure Service

- **Name**: `ten-ml-perfume-api`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: Free (or Starter if you need)

### 3. Add Environment Variables

In Render dashboard, go to "Environment" and add these variables:

```
MONGODB_URI=mongodb+srv://20maksudur00_db_user:4gG6arJtiK2Gd5Ak@cluster0.gnvmi5n.mongodb.net/ten_ml_perfume
PORT=5000
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=ten-ml-perfumes
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=LFdMw_Ga1qaOz4i3Xqp9JpGXGTY
```

### 4. Deploy

1. Review the configuration
2. Click "Deploy"
3. Wait for deployment to complete (3-5 minutes)
4. Your backend URL will be: `https://ten-ml-perfume-api.onrender.com`

### 5. Verify Deployment

Test your API:
```bash
curl https://ten-ml-perfume-api.onrender.com/api/test-db
```

Expected response:
```json
{
  "status": "success",
  "message": "Connected to MongoDB successfully!",
  "database": "perfume_store",
  "collections": 0,
  "dataSize": 0
}
```

## Environment Variables Reference

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `PORT` | Server port (usually 5000) |
| `NODE_ENV` | Set to `production` for Render |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |

## Troubleshooting

### Build Fails
- Check logs: Click service → "Logs" tab
- Ensure all dependencies are in package.json
- Try `npm run build` locally first

### Runtime Errors
- Check environment variables are set correctly
- Verify MongoDB connection string is valid
- Check IP whitelist in MongoDB Atlas

### API Not Responding
- Make sure service status is "Running"
- Check firewall/network settings
- Verify correct port in start command

## Update Deployment

When you push new code to GitHub:
1. Render automatically redeploys
2. Can also manually trigger: Service → "Manual Deploy"

## Important Notes

- Free tier on Render has 15-minute inactivity limit
- Project will spin down if no requests for 15 minutes
- First request after spin-down will take longer
- Use Starter plan for always-on production
