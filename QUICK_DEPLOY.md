# Quick Deploy to Vercel - Get Live Links in 5 Minutes

## Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`

## Quick Steps

### Step 1: Deploy Backend

```bash
cd prescripto-full-stack/backend
vercel --prod
```

**When prompted:**
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No** (first time)
- Project name: **medichain-backend**
- Directory: **./**
- Override settings? **No**

**Set Environment Variables in Vercel Dashboard after first deploy:**
- Go to your project → Settings → Environment Variables
- Add:
  ```
  MONGODB_URI=mongodb+srv://vemulaharshith1476_db_user:3Fy7SLnYqk6SKblw@medichain.btuitho.mongodb.net/?appName=medichain
  JWT_SECRET=your_secret_here
  ADMIN_EMAIL=admin@example.com
  ADMIN_PASSWORD=your_password
  PORT=4000
  CURRENCY=INR
  ```
- Redeploy: `vercel --prod`

**Copy your backend URL** (e.g., `https://medichain-backend.vercel.app`)

---

### Step 2: Deploy Frontend

```bash
cd prescripto-full-stack/frontend
vercel --prod
```

**Set Environment Variable:**
- In Vercel Dashboard → Settings → Environment Variables
- Add: `VITE_BACKEND_URL=https://your-backend-url.vercel.app`
- Redeploy: `vercel --prod`

**Copy your frontend URL** (e.g., `https://medichain-frontend.vercel.app`)

---

### Step 3: Deploy Admin Panel (Optional)

```bash
cd prescripto-full-stack/admin
vercel --prod
```

**Set Environment Variable:**
- `VITE_BACKEND_URL=https://your-backend-url.vercel.app`
- Redeploy: `vercel --prod`

---

## Alternative: Web Dashboard Deployment

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Configure each project (backend, frontend, admin) separately
4. Set environment variables in dashboard
5. Deploy!

---

## Your Live Links Will Be:
- **Backend**: `https://your-backend-name.vercel.app`
- **Frontend**: `https://your-frontend-name.vercel.app`
- **Admin**: `https://your-admin-name.vercel.app`

**Note**: First deployment may take 2-3 minutes. Subsequent deployments are faster!

