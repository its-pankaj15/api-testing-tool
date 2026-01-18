# Development & Deployment Guide

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Project Configuration](#project-configuration)
3. [Build & Production](#build--production)
4. [Deployment](#deployment)
5. [Environment Variables](#environment-variables)
6. [Troubleshooting](#troubleshooting)

## Local Development Setup

### Prerequisites
- Node.js 18+ (verify with `node --version`)
- npm 8+ (or yarn/pnpm)
- Git (optional)
- Code editor (VS Code recommended)

### Step 1: Clone/Extract Project
```bash
cd c:\Users\ACER\api-testing-tool
```

### Step 2: Backend Setup

```bash
# Install dependencies
cd server
npm install

# Create environment file
copy .env.example .env
# Edit .env with your Supabase credentials
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_KEY=your_anon_key
# PORT=5000

# Start development server
npm run dev
# Server will run on http://localhost:5000
```

### Step 3: Frontend Setup

In a **new terminal**:

```bash
# Install dependencies
cd client
npm install

# Create environment file
copy .env.example .env
# Edit .env with your Supabase credentials
# VITE_API_URL=http://localhost:5000
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_KEY=your_anon_key

# Start development server
npm run dev
# App will run on http://localhost:3000
```

### Step 4: Verify Everything Works

1. **Backend Health Check**
   ```bash
   curl http://localhost:5000/health
   # Should return: {"status":"OK","timestamp":"..."}
   ```

2. **Open Frontend**
   - Navigate to http://localhost:3000
   - You should see the API Testing Tool UI

3. **Test Request**
   - Method: GET
   - URL: https://jsonplaceholder.typicode.com/posts/1
   - Click "Send Request"
   - Should see response with post data

## Project Configuration

### Backend Configuration

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "strict": true
  }
}
```

#### Environment Variables
```bash
# .env (Backend)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJhbGc...
PORT=5000
NODE_ENV=development
```

### Frontend Configuration

#### Vite Config
- Port: 3000
- Proxy: `/api` → `http://localhost:5000`
- Hot reload: Enabled

#### Tailwind Config
- Dark mode: Class-based
- Responsive: Mobile-first
- Plugins: None (extendable)

#### Environment Variables
```bash
# .env (Frontend)
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=eyJhbGc...
```

## Build & Production

### Building the Frontend

```bash
cd client

# Build for production
npm run build
# Output: client/dist/

# Preview build locally
npm run preview
```

### Building the Backend

```bash
cd server

# Build TypeScript
npm run build
# Output: server/dist/

# Run production build
npm start
```

### Production Environment Variables

**Backend (.env)**
```bash
SUPABASE_URL=https://prod-project.supabase.co
SUPABASE_KEY=prod_key_here
PORT=5000
NODE_ENV=production
```

**Frontend (.env.production)**
```bash
VITE_API_URL=https://api.yourdomain.com
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_KEY=prod_key_here
```

## Deployment

### Option 1: Vercel (Recommended for Frontend)

#### Deploy Frontend to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd client
vercel

# Set environment variables in Vercel dashboard
# - VITE_API_URL
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_KEY
```

### Option 2: Heroku (Backend)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set SUPABASE_URL=https://...
heroku config:set SUPABASE_KEY=...
heroku config:set PORT=5000

# Deploy
git push heroku main
```

### Option 3: Docker Deployment

#### Dockerfile (Backend)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src ./src
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

#### Dockerfile (Frontend)
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Option 4: Self-Hosted (Linux Server)

#### Setup PM2 (Process Manager)
```bash
npm install -g pm2

cd server
pm2 start dist/server.js --name api-testing-server
pm2 save
```

#### Setup Nginx (Reverse Proxy)
```nginx
# /etc/nginx/sites-available/api-testing
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

### Frontend (VITE_* prefixed)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xyz.supabase.co` |
| `VITE_SUPABASE_KEY` | Supabase anon key | `eyJhbGc...` |

### Backend

| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_URL` | Supabase project URL | `https://xyz.supabase.co` |
| `SUPABASE_KEY` | Supabase service key | `eyJhbGc...` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |

## Troubleshooting

### Backend won't start

**Error**: `Cannot find module 'express'`
```bash
cd server
npm install
# Make sure all dependencies are installed
```

**Error**: `EADDRINUSE: address already in use :::5000`
```bash
# Kill process on port 5000
# Windows: taskkill /PID <PID> /F
# Linux/Mac: kill -9 $(lsof -t -i:5000)

# Or change PORT in .env
```

### Frontend won't connect to backend

1. Check backend is running:
   ```bash
   curl http://localhost:5000/health
   ```

2. Verify `VITE_API_URL` is correct in `.env`

3. Check browser console for errors (F12)

4. Disable browser extensions (especially CORS-related)

### Supabase auth not working

1. Verify credentials:
   ```bash
   # Check .env file has correct values
   cat .env
   ```

2. Test Supabase connection:
   - Log into Supabase dashboard
   - Check project is active
   - Verify RLS policies

3. Clear browser cache and try again

### TypeScript compilation errors

```bash
# Rebuild
npm run build

# Check tsconfig
cat tsconfig.json

# Install missing types
npm install --save-dev @types/express @types/node
```

### Port conflicts

```bash
# List ports in use (Windows)
netstat -ano | findstr LISTENING

# List ports in use (Linux/Mac)
lsof -i -P -n | grep LISTEN

# Change port in .env or vite.config.ts
```

### Performance issues

1. **Clear node_modules and reinstall**
   ```bash
   rm -r node_modules package-lock.json
   npm install
   ```

2. **Check React devtools**
   - Disable React Strict Mode (optional)
   - Profile component renders

3. **Backend optimization**
   - Check database queries
   - Enable caching headers
   - Use gzip compression

## Monitoring

### Check Backend Health
```bash
curl http://localhost:5000/health
```

### View Server Logs
```bash
# If using PM2
pm2 logs api-testing-server
```

### Monitor Database
- Supabase Dashboard → SQL Editor
- View execution times
- Check indexes

## Security Checklist

- [ ] Change Supabase RLS policies for production
- [ ] Use HTTPS for all deployments
- [ ] Rotate API keys regularly
- [ ] Enable CORS only for allowed origins
- [ ] Validate user input
- [ ] Use rate limiting
- [ ] Enable database backups
- [ ] Set up error logging/monitoring

## Support

For deployment-specific issues:
1. Check server logs
2. Verify environment variables
3. Review firewall rules
4. Check database connectivity
5. Test API endpoints with curl/Postman

---

**Happy Deploying! 🚀**
