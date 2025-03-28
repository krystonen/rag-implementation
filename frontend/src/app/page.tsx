'use client';

import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { ComparisonResults } from './components/ComparisonResults';
import { DocumentUpload } from './components/DocumentUpload';
import { RAGResponse, SearchQuery } from '@/types';
import { searchDocuments, directLLMQuery } from './services/api';

export default function Home() {
  const [ragResults, setRagResults] = useState<RAGResponse | null>(null);
  const [llmResults, setLlmResults] = useState<{ answer: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: SearchQuery) => {
    setIsLoading(true);
    setError(null);
    try {
      // Get both RAG and direct LLM responses in parallel
      const [ragResponse, llmResponse] = await Promise.all([
        searchDocuments(query),
        directLLMQuery(query.query)
      ]);
      
      setRagResults(ragResponse);
      setLlmResults(llmResponse);
    } catch (err) {
      setError('Failed to fetch results. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadComplete = (results: any[]) => {
    console.log('Upload complete:', results);
    // You could add a success message or update the UI here
  };

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-12">
          RAG System Demo
        </h1>
        
        <div className="max-w-2xl mx-auto mb-16">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>
        
        <div className="mb-16">
          <ComparisonResults 
            ragResults={ragResults}
            llmResults={llmResults}
            isLoading={isLoading}
          />
        </div>

        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-6">Document Upload</h2>
          <DocumentUpload onUploadComplete={handleUploadComplete} />
        </div>
      </div>
    </main>
  );
}
