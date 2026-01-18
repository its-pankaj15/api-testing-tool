# Architecture & Design Document

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (React + Vite)                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Components Layer                                          │ │
│  │  ├─ RequestForm (input & formatting)                       │ │
│  │  ├─ ResponseViewer (response display)                      │ │
│  │  ├─ Sidebar (history & collections)                        │ │
│  │  ├─ AuthModal (login/signup)                               │ │
│  │  ├─ EnvironmentManager (env switching)                     │ │
│  │  └─ CollectionManager (request organization)              │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  State Management (Zustand)                                │ │
│  │  ├─ currentRequest                                          │ │
│  │  ├─ currentResponse                                         │ │
│  │  ├─ requestHistory                                          │ │
│  │  ├─ collections & environments                              │ │
│  │  └─ UI state (dark mode, sidebar)                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  API Layer (Axios)                                         │ │
│  │  ├─ api.ts (backend communication)                         │ │
│  │  ├─ supabase.ts (auth & database)                          │ │
│  │  └─ utils.ts (helpers)                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP
┌─────────────────────────────────────────────────────────────────┐
│              Backend (Express + TypeScript)                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Endpoints                                                 │ │
│  │  ├─ POST /api/proxy (CORS proxy)                           │ │
│  │  ├─ POST /api/requests (save request)                      │ │
│  │  ├─ GET /api/requests (fetch requests)                     │ │
│  │  ├─ DELETE /api/requests/:id (delete)                      │ │
│  │  ├─ POST /api/collections (create collection)              │ │
│  │  ├─ GET /api/collections (fetch collections)               │ │
│  │  └─ GET /health (status check)                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Middleware                                                │ │
│  │  ├─ CORS handler                                           │ │
│  │  ├─ JSON parser                                            │ │
│  │  └─ Error handler                                          │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP
┌─────────────────────────────────────────────────────────────────┐
│           Database (Supabase PostgreSQL)                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Tables                                                    │ │
│  │  ├─ auth.users (user accounts)                             │ │
│  │  ├─ requests (saved requests)                              │ │
│  │  ├─ collections (request groups)                           │ │
│  │  └─ environments (env variables)                           │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Request Flow
```
User Input
    ↓
RequestForm Component
    ↓
Zustand Store (currentRequest)
    ↓
apiClient.sendRequest()
    ↓
Axios POST /api/proxy
    ↓
Express Backend (axios outbound request)
    ↓
Target API
    ↓
Response Object
    ↓
Zustand Store (currentResponse)
    ↓
ResponseViewer Component
```

### Save Request Flow
```
Response Viewer
    ↓
Save Modal
    ↓
apiClient.saveRequest()
    ↓
Axios POST /api/requests
    ↓
Supabase RLS Check
    ↓
Insert into requests table
    ↓
Success callback
    ↓
Update Collections in Sidebar
```

## Component Hierarchy

```
App.tsx (Main)
├── Header
│   ├── Menu Button (toggle sidebar)
│   ├── Title
│   └── Dark Mode Toggle
├── Sidebar
│   ├── History Tab
│   │   └── RequestList (clickable history)
│   └── Collections Tab
│       └── CollectionList
├── Main Content
│   ├── Error Alert
│   ├── Request Section
│   │   ├── RequestForm
│   │   │   ├── URL Input
│   │   │   ├── Method Selector
│   │   │   ├── Params Tab
│   │   │   ├── Headers Tab
│   │   │   └── Body Tab
│   │   └── Send Button
│   └── Response Section
│       └── ResponseViewer
│           ├── Status Display
│           ├── Metadata
│           ├── Response Tabs
│           └── Copy Button
└── Modals
    ├── AuthModal
    ├── SaveRequestModal
    ├── EnvironmentManager
    └── CollectionManager
```

## State Management with Zustand

### Store Structure

```typescript
interface AppStore {
  // Current Request State
  currentRequest: RequestData
  setCurrentRequest: (request: RequestData) => void
  
  // Response State
  currentResponse: Response | null
  setCurrentResponse: (response: Response | null) => void
  
  // History & Collections
  requestHistory: RequestData[]
  addToHistory: (request: RequestData) => void
  clearHistory: () => void
  collections: Collection[]
  setCollections: (collections: Collection[]) => void
  
  // Environments
  environments: Environment[]
  setEnvironments: (environments: Environment[]) => void
  activeEnvironment: Environment | null
  setActiveEnvironment: (env: Environment | null) => void
  
  // UI State
  isDarkMode: boolean
  toggleDarkMode: () => void
  sidebarOpen: boolean
  toggleSidebar: () => void
  
  // Loading State
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
}
```

### Why Zustand?
- ✅ Simple API (no providers needed)
- ✅ Minimal boilerplate
- ✅ Built-in localStorage support
- ✅ Great TypeScript support
- ✅ Performant (no re-render issues)

## API Client Pattern

### Request Proxy
```typescript
// Frontend sends request to backend proxy
POST /api/proxy
{
  method: "GET",
  url: "https://api.example.com/data",
  headers: { "Authorization": "Bearer token" },
  params: { "key": "value" },
  data: null
}

// Backend forwards with axios
// Response sent back with timing info
{
  status: 200,
  statusText: "OK",
  headers: { "content-type": "application/json" },
  data: { ... },
  duration: 234,
  size: 1024
}
```

## Database Schema Design

### Requests Table
```sql
id (UUID) PRIMARY KEY
user_id (UUID) FOREIGN KEY -> auth.users
name (VARCHAR)
method (VARCHAR) -- GET, POST, etc
url (TEXT)
headers (JSONB) -- { "key": "value" }
params (JSONB) -- { "key": "value" }
body (TEXT) -- Raw JSON string
collection_id (UUID) FOREIGN KEY -> collections (nullable)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)

Indexes:
- (user_id, created_at) for fast user queries
- (collection_id) for collection-based filtering
```

### Collections Table
```sql
id (UUID) PRIMARY KEY
user_id (UUID) FOREIGN KEY -> auth.users
name (VARCHAR)
description (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)

Indexes:
- (user_id) for user's collections
```

### Environments Table
```sql
id (UUID) PRIMARY KEY
user_id (UUID) FOREIGN KEY -> auth.users
name (VARCHAR) -- "Development", "Production"
variables (JSONB) -- { "baseUrl": "http://localhost:3000", "token": "abc123" }
is_active (BOOLEAN)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)

Indexes:
- (user_id, is_active) for active env lookup
```

## Security Considerations

### Frontend
- ✅ Supabase RLS automatically enforced
- ✅ User data isolated by user_id
- ✅ Credentials not stored (token-based)
- ✅ HTTPS only in production

### Backend
- ✅ Validates all incoming requests
- ✅ CORS configured properly
- ✅ No sensitive data in responses
- ✅ Supabase auth token validation

### Database
- ✅ Row-level security (RLS) enabled
- ✅ Users can only see their own data
- ✅ Policies enforce access control
- ✅ Data encrypted at rest (Supabase)

## Performance Optimizations

### Frontend
- **Code Splitting**: Lazy load modals
- **Memoization**: React.memo on request list
- **Debouncing**: Sidebar search/filter
- **Virtual Lists**: For large history
- **Dark Mode**: CSS class switching (no re-render)

### Backend
- **Caching**: Response headers for static data
- **Indexing**: Database indexes on frequent queries
- **Async/Await**: Non-blocking I/O
- **Connection Pooling**: Reuse connections

### Network
- **Gzip Compression**: Reduce payload size
- **Keep-Alive**: Persistent connections
- **CDN**: Serve frontend from edge
- **Caching Headers**: Browser caching

## Error Handling Strategy

### Frontend
```typescript
try {
  const response = await apiClient.sendRequest(request)
  setCurrentResponse(response)
} catch (err) {
  setError(err.message) // Display to user
  // Log to Sentry/similar
}
```

### Backend
```typescript
app.post('/api/proxy', async (req, res) => {
  try {
    const response = await axios(...)
    res.json(response.data)
  } catch (error) {
    // Log error
    res.status(400).json({
      error: error.message,
      details: error.response?.data
    })
  }
})
```

## Testing Strategy

### Unit Tests
- Component rendering
- Store actions
- Utility functions
- API client

### Integration Tests
- Request flow end-to-end
- Save/load operations
- Auth flows

### E2E Tests
- Full user workflows
- API testing scenarios
- Supabase integration

## Future Architecture Improvements

1. **Request Queue**
   - Allow multiple concurrent requests
   - Request execution priority

2. **WebSocket Support**
   - Real-time data updates
   - Live response streaming

3. **Scripting Engine**
   - Pre/post request hooks
   - Test assertions

4. **GraphQL Support**
   - GraphQL query builder
   - Schema introspection

5. **Team Collaboration**
   - Shared workspaces
   - Request sharing
   - Version history

6. **Advanced Analytics**
   - Request metrics
   - Performance trends
   - API health monitoring

---

**Architecture designed for scalability and extensibility** 🏗️
