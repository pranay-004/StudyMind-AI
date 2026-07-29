import axios from 'axios';

// Get API URL from env or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000, // 45 seconds timeout for LLM generation
});

/**
 * Calls backend to generate study material.
 * Supports AbortSignal for canceling duplicate/stale requests.
 */
export const generateStudyMaterial = async (notes, signal) => {
  try {
    const response = await apiClient.post('/api/generate', { notes }, { signal });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      // Return a special token indicating request was canceled
      return { canceled: true };
    }
    
    // Parse error structure returned by FastAPI
    const errorMessage = error.response?.data?.detail || error.message;
    const isTimeout = error.code === 'ECONNABORTED' || error.message.includes('timeout');
    const isNetworkError = error.message === 'Network Error' || !error.response;
    
    throw {
      message: errorMessage,
      isTimeout,
      isNetworkError,
      status: error.response?.status,
      originalError: error,
    };
  }
};

export default apiClient;
