# Vercel Deployment Guide

## Prerequisites
- Push your code to GitHub
- Have Vercel account (vercel.com)
- Backend deployed to Render (get the URL)

## Step-by-Step Deployment

### 1. Import Project on Vercel

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Click "Import Git Repository"
4. Select your GitHub repository
5. Click "Import"

### 2. Configure Project

- **Framework Preset**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### 3. Add Environment Variables

Click "Environment Variables" and add:

```
NEXT_PUBLIC_BACKEND_URL=https://ten-ml-perfume-api.onrender.com
NEXT_PUBLIC_API_URL=https://YOUR_VERCEL_URL.vercel.app
```

**Important**: Replace `YOUR_VERCEL_URL` with your actual Vercel project name/URL

For local development, keep `.env.local`:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Deploy

1. Review all settings
2. Click "Deploy"
3. Wait for deployment (1-3 minutes)
4. Your frontend URL will be assigned automatically
5. Update `NEXT_PUBLIC_API_URL` with your actual Vercel URL after first deployment

### 5. Verify Deployment

1. Click on the deployment to view it
2. Check that pages load correctly
3. Open browser console (F12) for any errors
4. Test API calls in network tab

## Environment Variables Reference

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | Your Render backend URL |
| `NEXT_PUBLIC_API_URL` | Your Vercel frontend URL |

**Note**: `NEXT_PUBLIC_*` variables are exposed to browser. Never put secrets here.

## Post-Deployment Configuration

### Update Backend with Frontend URL

After Vercel gives you your frontend URL, update Render environment:

1. Go to Render dashboard
2. Select your service
3. Go to "Environment"
4. Add (if needed):
   ```
   NEXT_PUBLIC_API_URL=https://your-vercel-url.vercel.app
   ```

### Enable CORS (if needed)

In your Next.js backend, ensure CORS header:

```typescript
// In your API routes
response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_API_URL)
```

## Troubleshooting

### Build Fails
- Check build logs: Deployment → "Logs"
- Ensure `next.config.js` is valid
- Try `npm run build` locally first
- Clear `.next` folder and try again

### API Not Responding
- Verify `NEXT_PUBLIC_BACKEND_URL` is correct
- Check Render backend is running
- Open browser DevTools → Network tab to see requests
- Check CORS errors in console

### Environment Variables Not Working
- Verify variable names start with `NEXT_PUBLIC_`
- Redeploy after changing variables
- Check `.env.local` for local development

### Images Not Loading
- Verify Cloudinary credentials in Render
- Check image URLs are correct
- Test upload on local development first

## Update Deployment

When you push to GitHub:
1. Vercel automatically deploys on push (if enabled)
2. Can manually deploy: Projects → Select → Deployments → "Redeploy"
3. Previous deployments available for instant rollback

## Deployment Checklist

- [ ] GitHub repository connected
- [ ] Environment variables set
- [ ] Backend deployed on Render
- [ ] Backend URL working
- [ ] Frontend deployed on Vercel
- [ ] Frontend URL obtained
- [ ] Environment variables updated with correct URLs
- [ ] Test homepage loads
- [ ] Test API calls work
- [ ] Test image upload works

## Custom Domain Setup

To use a custom domain:

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (up to 24 hours)

## Important Notes

- Deployments are automatic on `git push` (configurable)
- Vercel provides free SSL/HTTPS
- Free tier supports unlimited deployments
- Faster builds with Vercel Analytics
- Automatic rollback to previous deployment available
