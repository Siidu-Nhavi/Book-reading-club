# Deployment Plan: Vercel + Render

## Overview
- **Frontend**: React + Vite → Vercel
- **Backend**: Node.js + Express → Render
- **Database**: MongoDB (configure in Render environment)

---

## Phase 1: Pre-Deployment Setup

### 1.1 Frontend Preparation (Vercel)

#### Environment Configuration
```bash
# Create .env.production file in frontend/
VITE_API_URL=https://your-backend.onrender.com  # Update after backend deployment
```

#### Update API Client
- Update `frontend/src/api/client.js` to use environment variable for API URL
- Ensure all API calls reference the correct backend URL

#### Build Configuration
- Verify `vite.config.js` is properly configured
- Ensure build output is in `dist/` directory
- Test build locally: `npm run build`

### 1.2 Backend Preparation (Render)

#### Environment Variables Needed
```
NODE_ENV=production
PORT=10000
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CORS_ORIGIN=https://your-frontend.vercel.app
```

#### Dependencies Check
- Ensure all required packages in `server/package.json`
- Verify `server.js` listens on process.env.PORT

#### CORS Configuration
```javascript
// In server.js, configure CORS for Vercel domain
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
```

---

## Phase 2: Backend Deployment (Render)

### Step 1: Prepare Render Deployment
1. Push code to GitHub repository
2. Create account on [render.com](https://render.com)
3. Connect GitHub repository

### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Select your GitHub repository
3. Configure:
   - **Name**: `book-club-backend` (or your choice)
   - **Environment**: Node
   - **Branch**: main
   - **Build Command**: `npm install`
   - **Start Command**: `node server/server.js`
   - **Plan**: Free tier to start

### Step 3: Set Environment Variables
1. In Render dashboard, go to Environment
2. Add all variables from section 1.2:
   - `NODE_ENV=production`
   - `PORT=10000`
   - `DATABASE_URL=mongodb+srv://...`
   - `JWT_SECRET=<generate-secure-key>`
   - `CORS_ORIGIN=<will-update-after-frontend-deployed>`

### Step 4: Deploy
- Render automatically deploys on push to main branch
- Monitor deployment logs
- Note the deployed URL: `https://your-backend.onrender.com`

---

## Phase 3: Frontend Deployment (Vercel)

### Step 1: Update Backend URL
1. Update `.env.production` with Render backend URL
```
VITE_API_URL=https://your-backend.onrender.com
```

### Step 2: Connect to Vercel
1. Create account on [vercel.com](https://vercel.com)
2. Click "New Project" → Select GitHub repository
3. Choose `frontend` as root directory

### Step 3: Configure Build Settings
- **Framework**: Vite
- **Build Command**: `npm run build` (or `vite build`)
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Set Environment Variables
1. In Vercel project settings → Environment Variables
2. Add:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

### Step 5: Deploy
1. Click Deploy
2. Wait for build and deployment to complete
3. Note the frontend URL: `https://your-app.vercel.app`

---

## Phase 4: Post-Deployment Configuration

### Step 1: Update Backend CORS
1. Go back to Render environment variables
2. Update `CORS_ORIGIN` to your Vercel URL:
   ```
   CORS_ORIGIN=https://your-app.vercel.app
   ```
3. Redeploy backend on Render

### Step 2: Test Integration
- Visit frontend URL
- Test authentication (login/register)
- Test API calls (fetch books, rentals, reviews)
- Check browser console for CORS errors
- Monitor Render logs for backend errors

### Step 3: Enable Automatic Deployments
Both platforms support automatic deployments on push to main:
- **Vercel**: Automatically enabled
- **Render**: Enabled by default for connected repos

---

## Pre-Deployment Checklist

### Frontend
- [ ] `.env.production` configured with backend URL
- [ ] `src/api/client.js` uses `process.env.VITE_API_URL`
- [ ] Local build succeeds: `npm run build`
- [ ] No hardcoded localhost URLs in code
- [ ] ESLint warnings resolved
- [ ] All pages/components working locally

### Backend
- [ ] `server.js` uses `process.env.PORT`
- [ ] MongoDB connection configured for production
- [ ] CORS middleware properly configured
- [ ] All required environment variables documented
- [ ] `.env` file NOT committed to git (add to `.gitignore`)
- [ ] Error handling implemented
- [ ] Sensitive data in environment variables only

### General
- [ ] Code committed to GitHub
- [ ] Repository is public or private as intended
- [ ] No sensitive credentials in code
- [ ] Database ready and accessible

---

## Important Notes

### Render Specifics
- Free tier has some limitations, may enter sleep mode after inactivity
- Recommended: Upgrade to Starter plan for production ($7/month)
- Database should be hosted separately (MongoDB Atlas recommended)

### Vercel Specifics
- Free tier includes serverless function deployments
- Auto-scaling and CDN included
- Environment variables are secure

### Database Recommendation
- Use **MongoDB Atlas** (free tier available)
- Update `DATABASE_URL` in Render environment

---

## Troubleshooting

### CORS Errors
- Verify `CORS_ORIGIN` in Render matches Vercel URL exactly
- Check browser console for error details

### API Connection Fails
- Verify `VITE_API_URL` in frontend `.env.production`
- Check Render backend logs for errors
- Ensure backend is not in sleep mode (might need Starter plan)

### Build Failures
- Check deployment logs in Vercel/Render dashboards
- Verify build commands match your project structure
- Ensure all dependencies are in `package.json`

---

## Monitoring & Maintenance

1. **Set up monitoring** on Render for backend uptime
2. **Monitor Vercel Analytics** for frontend performance
3. **Set deployment notifications** in both platforms
4. **Plan for database backups** if using MongoDB
5. **Keep dependencies updated** regularly

---

## Next Steps
1. Prepare code for production (follow checklist above)
2. Deploy backend to Render first
3. Update frontend environment and deploy to Vercel
4. Verify API integration works
5. Test full user workflows
