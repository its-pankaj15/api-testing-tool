# API Testing Server

Backend server for Postman-like API testing tool.

## Setup

1. Create a `.env` file in this directory:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
PORT=5000
```

2. Install dependencies:
```
npm install
```

3. Run in development:
```
npm run dev
```

## Endpoints

- `POST /api/proxy` - Forward API requests (bypasses CORS)
- `POST /api/requests` - Save request
- `GET /api/requests` - Get all requests
- `DELETE /api/requests/:id` - Delete request
- `POST /api/collections` - Create collection
- `GET /api/collections` - Get all collections
