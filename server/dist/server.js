import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '');
// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
// Proxy endpoint - bypasses CORS
app.post('/api/proxy', async (req, res) => {
    try {
        const { method, url, headers = {}, params = {}, data } = req.body;
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
    }
    catch (error) {
        const axiosError = error;
        res.status(400).json({
            error: axiosError.message || 'Request failed',
            details: axiosError.response?.data || null,
        });
    }
});
// Save request
app.post('/api/requests', async (req, res) => {
    try {
        const request = req.body;
        const { data, error } = await supabase
            .from('requests')
            .insert([request])
            .select();
        if (error)
            throw error;
        res.json({ message: 'Request saved', data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Get all requests for user
app.get('/api/requests', async (req, res) => {
    try {
        const userId = req.query.userId;
        const { data, error } = await supabase
            .from('requests')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Delete request
app.delete('/api/requests/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('requests')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        res.json({ message: 'Request deleted' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Create collection
app.post('/api/collections', async (req, res) => {
    try {
        const collection = req.body;
        const { data, error } = await supabase
            .from('collections')
            .insert([collection])
            .select();
        if (error)
            throw error;
        res.json({ message: 'Collection created', data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Get all collections
app.get('/api/collections', async (req, res) => {
    try {
        const userId = req.query.userId;
        const { data, error } = await supabase
            .from('collections')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Proxy endpoint: POST /api/proxy');
});
