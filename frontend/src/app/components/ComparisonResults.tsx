'use client';

import { RAGResponse } from '@/types';

interface ComparisonResultsProps {
  ragResults: RAGResponse | null;
  llmResults: { answer: string } | null;
  isLoading: boolean;
}

export const ComparisonResults: React.FC<ComparisonResultsProps> = ({
  ragResults,
  llmResults,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Group sources by filename or source
  const groupedSources = ragResults?.sources.reduce((acc, source) => {
    const key = source.metadata.filename || source.metadata.source || 'Unknown Source';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(source);
    return acc;
  }, {} as Record<string, typeof ragResults.sources>) || {};

  const formatSourceInfo = (source: any) => {
    const parts = [];
    
   
    // Add author if available
    if (source.metadata.author) {
      parts.push(`By ${source.metadata.author}`);
    }
    
    // Add category if available
    if (source.metadata.category) {
      parts.push(source.metadata.category);
    }

    return parts.join(' | ');
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* RAG Response */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold">RAG Response</h2>
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              With Context
            </span>
          </div>
          {ragResults ? (
            <>
              <p className="text-gray-700 whitespace-pre-wrap mb-6">{ragResults.answer}</p>
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-3">Sources Used</h3>
                <div className="space-y-4">
                  {Object.entries(groupedSources).map(([key, sources]) => (
                    <div key={key} className="text-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{key}</span>
                        <span className="text-gray-500">
                          {/* {sources.length} relevant {sources.length === 1 ? 'chunk' : 'chunks'} */}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {sources.map((source, index) => (
                          <div key={index} className="text-gray-600 bg-gray-50 p-2 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs">
                                {formatSourceInfo(source)}
                              </span>
                              <span className="text-gray-500 text-xs">
                                {(source.similarity * 100).toFixed(1)}% relevant
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500">No results yet</p>
          )}
        </div>

        {/* Direct LLM Response */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold">Direct LLM Response</h2>
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
              Without Context
            </span>
          </div>
          {llmResults ? (
            <p className="text-gray-700 whitespace-pre-wrap">{llmResults.answer}</p>
          ) : (
            <p className="text-gray-500">No results yet</p>
          )}
        </div>
      </div>
    </div>
  );
}; 