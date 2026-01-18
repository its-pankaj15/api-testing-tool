import axios, { AxiosError } from 'axios';
import type { RequestData, Response } from './store';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = {
  // Proxy request
  async sendRequest(request: RequestData): Promise<Response> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/proxy`, {
        method: request.method,
        url: request.url,
        headers: request.headers,
        params: request.params,
        data: request.body ? JSON.parse(request.body) : undefined,
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(axiosError.message || 'Request failed');
    }
  },

  // Request management
  async saveRequest(request: RequestData, userId: string): Promise<void> {
    await axios.post(`${API_BASE_URL}/api/requests`, {
      ...request,
      user_id: userId,
    });
  },

  async getRequests(userId: string): Promise<RequestData[]> {
    const response = await axios.get(`${API_BASE_URL}/api/requests`, {
      params: { userId },
    });
    return response.data;
  },

  async deleteRequest(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api/requests/${id}`);
  },

  // Collection management
  async createCollection(
    name: string,
    userId: string,
    description?: string
  ): Promise<void> {
    await axios.post(`${API_BASE_URL}/api/collections`, {
      name,
      description,
      user_id: userId,
    });
  },

  async getCollections(userId: string): Promise<any[]> {
    const response = await axios.get(`${API_BASE_URL}/api/collections`, {
      params: { userId },
    });
    return response.data;
  },
};
