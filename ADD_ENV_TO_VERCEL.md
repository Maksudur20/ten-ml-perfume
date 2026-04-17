# 🚨 Fix: Add MongoDB URI to Vercel Dashboard

## The Problem
Your `/api/test-db` endpoint returns 404 because the `MONGODB_URI` environment variable isn't set in Vercel production.

## The Solution (3 minutes)

### Step 1: Go to Vercel Dashboard
👉 https://vercel.com/dashboard

### Step 2: Select Your Project
- Click on **ten-ml-perfume** project
- Or go directly to: https://vercel.com/dashboard/ten-ml-perfume

### Step 3: Open Settings
- Click **Settings** tab (top navigation)
- Click **Environment Variables** (left sidebar)

### Step 4: Add MongoDB URI
- Click **"Add New"** button
- **Name field**: Type exactly `MONGODB_URI`
- **Value field**: Paste this entire string:
  ```
  mongodb+srv://angkonnath1_db_user:helloworld27@cluster0.luy9upq.mongodb.net/?appName=Cluster0
  ```

### Step 5: Select Environments
Check these boxes:
- ✅ Production
- ✅ Preview  
- ✅ Development

### Step 6: Save
- Click **"Save"** button
- You'll see: "Environment variables successfully updated"

---

## Wait for Redeployment

After saving, Vercel will automatically:
1. Redeploy your application (takes 1-2 minutes)
2. Make the environment variable available to your API routes

---

## Test Again

After 2-3 minutes, visit:
```
https://ten-ml-perfume.vercel.app/api/test-db
```

You should see:
```json
{
  "status": "success",
  "message": "Connected to MongoDB successfully!",
  "database": "perfume_store",
  "collections": 0,
  "dataSize": 0,
  "timestamp": "2026-04-16T..."
}
```

---

## Screenshots Guide

**Settings Page:**
1. Vercel Dashboard → Click your project
2. Top navigation: Settings | Deployments | Domains
3. Left sidebar: Environment Variables

**Add Environment Variable:**
- Button: "Add New" (top right)
- Input 1: Name = `MONGODB_URI`
- Input 2: Value = `mongodb+srv://angkonnath1_db_user:helloworld27@cluster0.luy9upq.mongodb.net/?appName=Cluster0`
- Checkboxes: Select Production, Preview, Development
- Button: "Save"

---

## ✅ After It Works

Once you see the success message, your production MongoDB is connected!

You can now:
- ✅ Test all API endpoints
- ✅ Store admin products in MongoDB
- ✅ Save customer orders
- ✅ Persist reviews

---

**Let me know once you've added it and we can test it together!** 🚀
