# Deploying Recipe Builder to Render

This guide will help you deploy the Recipe Builder application to Render.

## Prerequisites

1. A [Render](https://render.com) account
2. An OpenAI API key from [platform.openai.com](https://platform.openai.com)
3. Your code pushed to a GitHub repository

## Step-by-Step Deployment

### Option 1: Using the Dashboard (Recommended for beginners)

1. **Create a New Web Service**
   - Log into [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure the Service**
   - **Name**: `recipe-builder` (or your preferred name)
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     npm install && npx prisma generate && npx prisma migrate deploy && npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```

3. **Add Environment Variables**
   Click "Environment" and add these variables:

   | Key | Value | Notes |
   |-----|-------|-------|
   | `DATABASE_URL` | (Auto-generated from Render Postgres) | See step 4 |
   | `NEXTAUTH_URL` | `https://your-app-name.onrender.com` | Replace with your actual URL |
   | `NEXTAUTH_SECRET` | (Generate random string) | Use: `openssl rand -base64 32` |
   | `OPENAI_API_KEY` | `sk-...` | Your OpenAI API key |
   | `ADMIN_EMAIL` | `admin@recipebuilder.com` | Can be changed |
   | `ADMIN_PASSWORD` | `admin123` | **Change this!** |
   | `NODE_VERSION` | `18.17.0` | Ensures correct Node version |

4. **Add PostgreSQL Database**
   - From your Render dashboard, click "New +" → "PostgreSQL"
   - **Name**: `recipe-builder-db`
   - **Plan**: Free tier is fine for testing
   - After creation, go to your web service
   - In Environment variables, add:
     - Key: `DATABASE_URL`
     - Value: Copy the "Internal Database URL" from your Postgres instance

5. **Update Prisma Schema for PostgreSQL**

   Before deploying, update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your app
   - The first deployment takes 5-10 minutes

7. **Seed the Database**
   After the first deployment completes:
   - Go to your web service → "Shell" tab
   - Run: `npm run seed`
   - This creates the admin user and sample recipes

8. **Access Your App**
   - Your app will be available at `https://your-app-name.onrender.com`
   - Log in with the admin credentials you set

### Option 2: Using Blueprint (One-Click Deploy)

1. **Push `render.yaml` to your repo**
   - The `render.yaml` file is already included
   - Commit and push to GitHub

2. **Deploy from Blueprint**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Select your repository
   - Render will detect `render.yaml` and set up everything

3. **Configure Environment Variables**
   - Render will prompt you to add required environment variables
   - Add `NEXTAUTH_URL`, `OPENAI_API_KEY`, etc.

4. **Deploy**
   - Click "Apply" and wait for deployment

### Option 3: Using Render CLI

```bash
# Install Render CLI
npm install -g render-cli

# Login
render login

# Deploy
render deploy
```

## Important Configuration Notes

### Database Migration

For production, you **must** use PostgreSQL instead of SQLite:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. The build command will automatically run migrations:
   ```bash
   npx prisma migrate deploy
   ```

### Handling Build Errors

**If you get quote-related errors:**

The error `unexpected EOF while looking for matching quote` usually means:
- Remove any complex shell commands with nested quotes
- Use simple, single-line commands
- Avoid using scripts with `&&` chains in the Render UI

**Solution:**
Use the exact commands provided above without modifications.

**If builds are slow:**
- Render's free tier has limited resources
- First build takes 5-10 minutes
- Subsequent builds are faster due to caching

### Security Checklist

Before going to production:

- ✅ Change `ADMIN_PASSWORD` from default
- ✅ Use a strong `NEXTAUTH_SECRET` (32+ characters)
- ✅ Never commit `.env` file (it's in `.gitignore`)
- ✅ Set `NEXTAUTH_URL` to your production URL
- ✅ Protect your OpenAI API key
- ✅ Use Render's secret management for sensitive values

## Troubleshooting

### Issue: "Cannot find module 'next-auth'"
**Solution:** Make sure `next-auth` is in `dependencies`, not `devDependencies`

### Issue: Build succeeds but app won't start
**Solution:** Check these:
1. `DATABASE_URL` is set correctly
2. `NEXTAUTH_SECRET` is set
3. Port is not hardcoded (use `process.env.PORT`)

### Issue: Database connection errors
**Solution:**
1. Verify `DATABASE_URL` is the **Internal Database URL**
2. Make sure the Postgres instance is running
3. Run migrations: `npx prisma migrate deploy`

### Issue: "Cannot connect to OpenAI"
**Solution:**
1. Verify your `OPENAI_API_KEY` is correct
2. Check your OpenAI account has available credits

## Monitoring Your App

1. **Logs**: View real-time logs in Render Dashboard → Your Service → Logs
2. **Metrics**: Monitor performance in the Metrics tab
3. **Shell Access**: Use Shell tab to run commands directly

## Updating Your App

To deploy updates:

1. Push changes to your GitHub repository
2. Render automatically detects changes and redeploys
3. Or manually trigger deployment from the dashboard

## Scaling

**Free Tier Limitations:**
- Apps spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month free

**To scale:**
- Upgrade to Starter ($7/month) for always-on hosting
- Add more web service instances for load balancing
- Upgrade database for better performance

## Alternative: Using Docker (Advanced)

If you prefer Docker deployment:

1. Create a `Dockerfile` (example provided in repo)
2. Push to Docker Hub or GitHub Container Registry
3. Deploy as Docker service on Render

## Support

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **App Issues**: Check the README.md
- **Database Issues**: Verify Prisma schema and migrations

---

**Quick Reference - Essential Commands:**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database
npm run seed

# Build for production
npm run build

# Start production server
npm start
```

Good luck with your deployment! 🚀
