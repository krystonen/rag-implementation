'use client';

import { RAGResponse } from '@/types';

interface SearchResultsProps {
  results: RAGResponse | null;
  isLoading: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 space-y-8">
      {/* Answer Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Answer</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{results.answer}</p>
      </div>

      {/* Sources Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Sources</h2>
        <div className="space-y-4">
          {results.sources.map((source, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-gray-500">
                    Source: {source.metadata.source} | Author: {source.metadata.author}
                  </p>
                  <p className="text-sm text-gray-500">
                    Category: {source.metadata.category}
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  Similarity: {(source.similarity * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-gray-700">{source.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 