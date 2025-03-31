import { RAGResponse, SearchQuery } from '@/types';

const API_BASE_URL = 'http://localhost:3001/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

if (!API_KEY) {
  console.error('API key is not set in environment variables');
}

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY || '',
};

export const searchDocuments = async (query: SearchQuery): Promise<RAGResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/search`, {
      method: 'POST',
      headers,
      body: JSON.stringify(query),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching documents:', error);
    throw error;
  }
};

export const directLLMQuery = async (query: string): Promise<{ answer: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/direct-query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Failed to get LLM response');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting LLM response:', error);
    throw error;
  }
}; 