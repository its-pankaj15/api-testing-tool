import express from 'express';
import type { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios, { AxiosError } from 'axios';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Types
interface ProxyRequest {
  method: string;
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  data?: unknown;
}

interface SavedRequest {
  id?: string;
  name: string;
  method: string;
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: string;
  collectionId?: string;
  user_id?: string;
  created_at?: string;
}

interface Collection {
  id?: string;
  name: string;
  description?: string;
  user_id?: string;
  created_at?: string;
}

// Proxy endpoint - bypasses CORS
app.post('/api/proxy', async (req: Request, res: Response) => {
  try {
    const { method, url, headers = {}, params = {}, data }: ProxyRequest = req.body;

    const startTime = Date.now();

    const response = await axios({
      method: method.toUpperCase(),
      url,
      headers: {
        'User-Agent': 'API-Testing-Tool/1.0',
        ...headers,
      },
      params,
      data,
      validateStatus: () => true, // Accept all status codes
    });

    const duration = Date.now() - startTime;

    res.json({
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      duration,
      size: JSON.stringify(response.data).length,
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    res.status(400).json({
      error: axiosError.message || 'Request failed',
      details: axiosError.response?.data || null,
    });
  }
});

// Save request
app.post('/api/requests', async (req: Request, res: Response) => {
  try {
    const request: SavedRequest = req.body;

    const { data, error } = await supabase
      .from('requests')
      .insert([request])
      .select();

    if (error) throw error;

    res.json({ message: 'Request saved', data });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Get all requests for user
app.get('/api/requests', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;

    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Delete request
app.delete('/api/requests/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('requests')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Request deleted' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Create collection
app.post('/api/collections', async (req: Request, res: Response) => {
  try {
    const collection: Collection = req.body;

    const { data, error } = await supabase
      .from('collections')
      .insert([collection])
      .select();

    if (error) throw error;

    res.json({ message: 'Collection created', data });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Get all collections
app.get('/api/collections', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;

    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Proxy endpoint: POST /api/proxy');
});
