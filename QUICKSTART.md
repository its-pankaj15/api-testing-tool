# Quick Start Guide

Get the API Testing Tool up and running in **5 minutes**!

## Prerequisites
- Node.js 18+ (download from nodejs.org)
- npm (comes with Node.js)
- Free Supabase account (optional, for persistence)

## 1️⃣ Clone/Download Project

```bash
cd c:\Users\ACER\api-testing-tool
# Project is ready to go!
```

## 2️⃣ Setup Supabase (Optional but Recommended)

### Create Account & Project
1. Go to https://supabase.com
2. Sign up for free
3. Create a new project
4. Save your credentials (Project URL and Anon Key)

### Run Database Setup
1. Open Supabase SQL Editor
2. Copy all SQL from `SUPABASE_SETUP.md`
3. Paste and execute

## 3️⃣ Start Backend Server

### Terminal 1:
```bash
cd server

# Install dependencies
npm install

# Create environment file
# Windows:
echo SUPABASE_URL=https://your-project.supabase.co > .env
echo SUPABASE_KEY=your_anon_key >> .env
echo PORT=5000 >> .env

# Or manually create .env and add:
# SUPABASE_URL=your_url
# SUPABASE_KEY=your_key
# PORT=5000

# Start server
npm run dev
```

✅ Backend running on: http://localhost:5000

## 4️⃣ Start Frontend (New Terminal)

### Terminal 2:
```bash
cd client

# Install dependencies
npm install

# Create environment file
# Windows:
echo VITE_API_URL=http://localhost:5000 > .env
echo VITE_SUPABASE_URL=https://your-project.supabase.co >> .env
echo VITE_SUPABASE_KEY=your_anon_key >> .env

# Or manually create .env and add:
# VITE_API_URL=http://localhost:5000
# VITE_SUPABASE_URL=your_url
# VITE_SUPABASE_KEY=your_key

# Start frontend
npm run dev
```

✅ App running on: http://localhost:3000

## 5️⃣ Test It Out!

1. **Open Browser**
   - Visit http://localhost:3000
   - You should see the API Testing Tool

2. **Send Your First Request**
   - Method: **GET**
   - URL: `https://jsonplaceholder.typicode.com/posts/1`
   - Click **Send Request**
   - See the response! 🎉

3. **Try POST Request**
   - Method: **POST**
   - URL: `https://jsonplaceholder.typicode.com/posts`
   - Headers: `Content-Type: application/json`
   - Body: `{"title": "test", "body": "test body", "userId": 1}`
   - Click **Send Request**

## 🎨 Features to Explore

### Request Features
- ✅ Change HTTP method (GET, POST, PUT, DELETE, etc)
- ✅ Add query parameters
- ✅ Add custom headers
- ✅ Send JSON body
- ✅ View request duration & size

### Response Features
- ✅ Color-coded status (green = success, red = error)
- ✅ Response time measurement
- ✅ Formatted JSON display
- ✅ Copy response to clipboard
- ✅ View response headers

### Sidebar Features
- ✅ **History Tab** - Click any request to reload it
- ✅ **Collections Tab** - Organize requests

### Settings
- ✅ **Dark Mode** - Toggle moon icon in header
- ✅ **Sidebar Toggle** - Hide/show with menu button

## 📝 Example Requests

### GET Request
```
Method: GET
URL: https://jsonplaceholder.typicode.com/users/1
```

### POST Request
```
Method: POST
URL: https://jsonplaceholder.typicode.com/posts
Headers:
  Content-Type: application/json

Body:
{
  "title": "New Post",
  "body": "This is a test post",
  "userId": 1
}
```

### GitHub API
```
Method: GET
URL: https://api.github.com/repos/microsoft/vscode
Headers:
  Accept: application/vnd.github.v3+json
```

### With Query Params
```
Method: GET
URL: https://jsonplaceholder.typicode.com/posts
Params:
  userId: 1
  _limit: 5
```

## 🔧 Troubleshooting

### "Can't reach server"
1. Check backend is running: `http://localhost:5000/health`
2. Verify port 5000 is not blocked
3. Restart backend with `npm run dev`

### "Supabase not working"
1. Check credentials in `.env` files
2. Verify project is active in Supabase
3. Make sure database setup was completed

### "Dark mode not working"
1. Clear browser cache
2. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### "Module not found errors"
1. Delete `node_modules` folder
2. Run `npm install` again
3. Restart dev server

## 🚀 Next Steps

### Save & Organize Requests
1. After sending request, click **Save** button
2. Give it a name (e.g., "Get User by ID")
3. Optionally select a collection
4. Click **Save**

### Create Collections
1. Click gear icon or open Collections modal
2. Create collection (e.g., "My API")
3. Save requests to collections

### Environment Variables (Advanced)
1. Open Environments modal
2. Create environment (e.g., "Development")
3. Add variables like `baseUrl`, `apiKey`
4. Switch between environments

### Dark Mode
1. Click moon icon in header
2. Preference automatically saved
3. Try again on next visit

## 📊 Performance Tips

- Keep request history under 100 items for best performance
- Use collections to organize large request sets
- Close browser tabs you're not using
- Clear history occasionally

## 🔒 Security Notes

- 🔐 Never commit `.env` files to git
- 🔐 API keys stay in your browser (never sent to our servers)
- 🔐 Use HTTPS URLs in production
- 🔐 Don't share request history with sensitive data

## 📚 Documentation

More detailed docs:
- **[README.md](README.md)** - Full feature overview
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design
- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Database schema

## 💡 Tips & Tricks

### Keyboard Shortcuts
- Focus URL input: Tab from method dropdown
- Send request: Ctrl+Enter (when ready)
- Copy response: Look for copy button

### Common APIs to Test
- **JSONPlaceholder** - https://jsonplaceholder.typicode.com
- **OpenWeather** - https://api.openweathermap.org
- **GitHub** - https://api.github.com
- **Random User** - https://randomuser.me/api
- **Public APIs** - https://github.com/public-apis/public-apis

### Save Time
1. Create "Templates" collection
2. Save common requests with placeholders
3. Duplicate and modify for similar requests

## 🆘 Getting Help

1. **Check Logs**
   - Browser console (F12)
   - Terminal output (backend)

2. **Verify Setup**
   - `.env` files exist
   - Node modules installed
   - Servers running on correct ports

3. **Restart Everything**
   - Kill both servers (Ctrl+C)
   - Clear browser cache
   - Restart both servers

## 🎉 Congratulations!

You now have a fully functional Postman-like API testing tool! 

Enjoy testing your APIs! 🚀

---

**Need more help?** See the other documentation files in the root directory.
