# Deployment Checklist

Follow this checklist to ensure proper deployment of the 10ml Perfume Store.

## Pre-Deployment

### Code Cleanup
- [ ] All old Vercel URLs removed
- [ ] All old Render URLs removed
- [ ] All old MongoDB URLs removed
- [ ] All old Cloudinary references cleaned
- [ ] No console.logs or debugging code left
- [ ] TypeScript compilation passes (`npm run build`)
- [ ] No ESLint errors (`npm run lint`)

### Environment Configuration
- [ ] `.env` file created with all required variables
- [ ] `.env` file is in `.gitignore`
- [ ] `.env.example` file exists with template values
- [ ] No sensitive credentials in code or git history

### Database Setup
- [ ] MongoDB Atlas account created
- [ ] New cluster created
- [ ] Database user created with strong password
- [ ] Connection string obtained
- [ ] IP address whitelisted in MongoDB Atlas
- [ ] Database name is `perfume_store`
- [ ] `MONGODB_URI` added to `.env`

### Cloud Storage Setup
- [ ] Cloudinary account created
- [ ] Cloud Name obtained
- [ ] API Key obtained
- [ ] API Secret obtained
- [ ] All three Cloudinary credentials added to `.env`

### Local Testing
- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts successfully
- [ ] Frontend loads on `http://localhost:3000`
- [ ] MongoDB test passes: `http://localhost:3000/api/test-db`
- [ ] Response includes "status": "success"
- [ ] Can navigate through all pages
- [ ] Can attempt to upload an image (test with Cloudinary)

## Backend Deployment (Render.com)

### Service Creation
- [ ] Render.com account created
- [ ] GitHub connected to Render
- [ ] New Web Service created
- [ ] Service name: `ten-ml-perfume-api`
- [ ] GitHub repository connected
- [ ] Correct branch selected

### Service Configuration
- [ ] Environment: `Node`
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`
- [ ] Service deployed successfully

### Environment Variables (Render)
- [ ] `MONGODB_URI` set correctly
- [ ] `PORT` set to `5000`
- [ ] `CLOUDINARY_CLOUD_NAME` set
- [ ] `CLOUDINARY_API_KEY` set
- [ ] `CLOUDINARY_API_SECRET` set
- [ ] `NODE_ENV` set to `production`

### Backend Verification
- [ ] Service shows "Running" status
- [ ] Test endpoint accessible: `https://your-service.onrender.com/api/test-db`
- [ ] Response shows successful MongoDB connection
- [ ] No errors in Render logs

## Frontend Deployment (Vercel)

### Project Setup
- [ ] Vercel account created
- [ ] GitHub connected to Vercel
- [ ] Project imported from GitHub

### Project Configuration
- [ ] Framework Preset: `Next.js`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`
- [ ] Install Command: `npm install`

### Environment Variables (Vercel)
- [ ] `NEXT_PUBLIC_BACKEND_URL` set to backend URL
- [ ] `NEXT_PUBLIC_API_URL` set to frontend URL
- [ ] All environment variables visible in Vercel dashboard

### Frontend Verification
- [ ] Deployment completed successfully
- [ ] Frontend loads on assigned Vercel URL
- [ ] All pages render correctly
- [ ] No deployment errors in logs

## Post-Deployment Testing

### Frontend Testing
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Product pages load
- [ ] Images load correctly
- [ ] Shopping cart functions
- [ ] Checkout process works

### Backend Testing
- [ ] API endpoints respond
- [ ] Database queries work
- [ ] MongoDB connection stable
- [ ] Cloudinary integration works
- [ ] Image uploads save correctly
- [ ] Error responses are clear

### Integration Testing
- [ ] Frontend can fetch data from backend
- [ ] Frontend displays API responses correctly
- [ ] API responses have correct format
- [ ] Image URLs work from frontend
- [ ] No CORS errors in browser console

### Production Monitoring
- [ ] Check Render logs for errors
- [ ] Check Vercel logs for errors
- [ ] Monitor API response times
- [ ] Monitor database performance
- [ ] Set up alerts for errors

## Rollback Plan

If issues occur:

1. **Frontend Issue**: Redeploy previous version from Vercel dashboard
2. **Backend Issue**: Redeploy previous version from Render dashboard
3. **Database Issue**: Restore from MongoDB backup
4. **API Integration**: Check environment variables on both services

## Security Checklist

- [ ] No hardcoded credentials anywhere
- [ ] HTTPS enabled on both frontend and backend
- [ ] API keys protected as environment variables
- [ ] MongoDB credentials secured
- [ ] Database user has minimal required permissions
- [ ] Cloudinary credentials never exposed to frontend
- [ ] `.env` file in `.gitignore`
- [ ] `.env.example` shows template (no real values)

## Final Sign-Off

- [ ] All testing passed
- [ ] All team members notified
- [ ] Users can access the deployed application
- [ ] No critical errors in logs
- [ ] Ready for production use

---

**Deployed Date**: _______________
**Deployed By**: _______________
**Notes**: _______________________________________________
