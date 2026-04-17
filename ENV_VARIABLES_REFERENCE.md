# Environment Variables - Complete Reference

## Your Current .env File

```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://20maksudur00_db_user:4gG6arJtiK2Gd5Ak@cluster0.gnvmi5n.mongodb.net/ten_ml_perfume

# Server Port
PORT=5000
NODE_ENV=development

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=ten-ml-perfumes
CLOUDINARY_API_KEY=get_your_api_key_from_dashboard  ← UPDATE THIS
CLOUDINARY_API_SECRET=LFdMw_Ga1qaOz4i3Xqp9JpGXGTY

# Frontend URL (for CORS and redirects)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Backend URL (when deployed)
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Production URLs (update after deployment)
# NEXT_PUBLIC_BACKEND_URL=https://your-api.onrender.com
# NEXT_PUBLIC_API_URL=https://your-app.vercel.app
```

---

## ⚠️ URGENT: Fix Cloudinary API Key

Your Cloudinary Cloud Name and Secret are correct, but the **API Key is missing**.

### How to Get Your Cloudinary API Key

1. **Open Cloudinary Console**
   - Go to: https://cloudinary.com/console
   - Log in with your Cloudinary account

2. **Navigate to API Keys**
   - Click on your profile icon (top right)
   - Select "Account Settings"
   - Or go directly: https://cloudinary.com/console/settings/api-keys

3. **Copy API Key**
   - Look for "API Key" (usually a long numeric string)
   - Copy the value
   - Do NOT copy the CLOUDINARY_URL

4. **Update .env**
   - Open `.env` file in VS Code
   - Find: `CLOUDINARY_API_KEY=get_your_api_key_from_dashboard`
   - Replace with your actual key
   - Save file

5. **Example**
   ```env
   CLOUDINARY_API_KEY=123456789012345
   ```

---

## Environment Variables Explained

### MongoDB Configuration

**MONGODB_URI**
```
mongodb+srv://20maksudur00_db_user:4gG6arJtiK2Gd5Ak@cluster0.gnvmi5n.mongodb.net/ten_ml_perfume
```
- **mongodb+srv://**: Secure connection protocol
- **20maksudur00_db_user**: Database user
- **4gG6arJtiK2Gd5Ak**: Password (yours)
- **cluster0.gnvmi5n.mongodb.net**: MongoDB Atlas server
- **ten_ml_perfume**: Database name
- **Status**: ✅ Already configured

### Server Configuration

**PORT**
- Value: `5000`
- Used by backend server
- Change if port is already in use
- Status: ✅ Configured

**NODE_ENV**
- Value: `development` (local) or `production` (deployed)
- Vercel/Render auto-set to production
- Status: ✅ Configured

### Cloudinary Configuration

**CLOUDINARY_CLOUD_NAME**
- Value: `ten-ml-perfumes` (your account)
- Used for image URL paths
- Status: ✅ Configured
- Found at: https://cloudinary.com/console

**CLOUDINARY_API_KEY**
- Value: ⚠️ **NEEDS UPDATE**
- Should be numeric (like: 123456789012345)
- Used for authentication on backend
- **NEVER** expose in frontend code
- Found at: https://cloudinary.com/console/settings/api-keys
- Status: ⚠️ **ACTION REQUIRED**

**CLOUDINARY_API_SECRET**
- Value: `LFdMw_Ga1qaOz4i3Xqp9JpGXGTY`
- **SENSITIVE**: Keep secret, never commit to Git
- Used only on backend for uploads
- **NEVER** expose to frontend
- Found at: https://cloudinary.com/console/settings/api-keys
- Status: ✅ Configured

### Frontend/Backend URLs

**NEXT_PUBLIC_API_URL**
- Local: `http://localhost:3000`
- Production: `https://your-vercel-app.vercel.app`
- Used by frontend to know its own URL
- Note: `NEXT_PUBLIC_*` is visible to browser
- Status: ✅ Configured (local)

**NEXT_PUBLIC_BACKEND_URL**
- Local: `http://localhost:5000`
- Production: `https://your-api.onrender.com`
- Used by frontend to call API
- Note: `NEXT_PUBLIC_*` is visible to browser
- Status: ✅ Configured (local)

---

## Environment Variables by Environment

### Local Development (.env)

```env
MONGODB_URI=mongodb+srv://20maksudur00_db_user...
PORT=5000
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=ten-ml-perfumes
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=LFdMw_Ga1qaOz4i3Xqp9JpGXGTY
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### Render Backend (Production)

Set these in Render Dashboard → Environment:

```env
MONGODB_URI=mongodb+srv://20maksudur00_db_user...
PORT=5000
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=ten-ml-perfumes
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=LFdMw_Ga1qaOz4i3Xqp9JpGXGTY
NEXT_PUBLIC_API_URL=https://your-vercel-url.vercel.app
```

### Vercel Frontend (Production)

Set these in Vercel Dashboard → Environment Variables:

```env
NEXT_PUBLIC_BACKEND_URL=https://your-api.onrender.com
NEXT_PUBLIC_API_URL=https://your-app.vercel.app
```

---

## Variable Types

### `NEXT_PUBLIC_*` Variables (Public)
These are built into the frontend and visible in browser:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_BACKEND_URL`

**Safety**: Only use for URLs, NEVER for secrets

### Secret Variables (Private)
These should ONLY be on backend, never sent to frontend:
- `MONGODB_URI`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

---

## Security Checklist

✅ Do:
- [ ] Keep `.env` in `.gitignore`
- [ ] Share `.env.example` with team (no real values)
- [ ] Rotate secrets periodically
- [ ] Use strong passwords
- [ ] Keep API secrets private
- [ ] Update after first deployment

❌ Don't:
- [ ] Commit `.env` to Git
- [ ] Upload `.env` to GitHub
- [ ] Share `.env` file with teammates
- [ ] Expose secrets in code
- [ ] Log secret values
- [ ] Use same secrets for multiple projects

---

## Common Issues & Solutions

### Issue: "CLOUDINARY_API_KEY is undefined"
**Solution**: Update the API key from Cloudinary dashboard

### Issue: MongoDB connection timeout
**Solution**: Check connection string and IP whitelist in MongoDB Atlas

### Issue: Environment variable not working on Vercel
**Solution**: 
1. Make sure it starts with `NEXT_PUBLIC_` (public variables only)
2. Redeploy after adding variables
3. Check it's under the right environment

### Issue: API calls fail on production
**Solution**: 
1. Verify `NEXT_PUBLIC_BACKEND_URL` is correct
2. Check Render backend is running
3. Verify CORS configuration

---

## How Environment Variables Are Used

### In Code

```typescript
// Frontend (can access NEXT_PUBLIC_* only)
const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL

// Backend (can access all variables)
const mongoUri = process.env.MONGODB_URI
const cloudinaryKey = process.env.CLOUDINARY_API_KEY
```

### At Build Time vs Runtime

**Next.js Build Time** (static values):
- `NEXT_PUBLIC_*` variables baked into code
- Must rebuild to update

**Runtime** (dynamic values):
- Backend environment variables
- Can change without rebuild

---

## Production Update Checklist

When deploying, update these:

### Render Backend
```
☐ MONGODB_URI (same as dev)
☐ CLOUDINARY_API_KEY (same as dev)
☐ CLOUDINARY_API_SECRET (same as dev)
☐ NODE_ENV = production
☐ NEXT_PUBLIC_API_URL (your Vercel URL)
```

### Vercel Frontend
```
☐ NEXT_PUBLIC_BACKEND_URL (your Render URL)
☐ NEXT_PUBLIC_API_URL (your Vercel URL)
```

**Note**: After getting Render URL, update Vercel variables and redeploy

---

## Helpful Resources

- Cloudinary API Keys: https://cloudinary.com/console/settings/api-keys
- MongoDB Connection String: https://www.mongodb.com/docs/manual/reference/connection-string/
- Environment Variables Best Practices: https://12factor.net/config
- Next.js Environment Variables: https://nextjs.org/docs/basic-features/environment-variables

---

## Summary

| Variable | Status | Action |
|----------|--------|--------|
| MONGODB_URI | ✅ Ready | None |
| PORT | ✅ Ready | None |
| NODE_ENV | ✅ Ready | None |
| CLOUDINARY_CLOUD_NAME | ✅ Ready | None |
| CLOUDINARY_API_KEY | ⚠️ Needs Update | Get from Cloudinary console |
| CLOUDINARY_API_SECRET | ✅ Ready | None |
| NEXT_PUBLIC_API_URL | ✅ Ready | Update after Vercel deploy |
| NEXT_PUBLIC_BACKEND_URL | ✅ Ready | Update after Render deploy |

**Your project is 99% ready! Just update the Cloudinary API Key and you're done! 🚀**
