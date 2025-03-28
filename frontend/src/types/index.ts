export interface Source {
  content: string;
  metadata: {
    filename: string;
    type: string;
    size: number;
    lastModified: number;
    chunkIndex: number;
    totalChunks: number;
    author?: string;
    source?: string;
    category?: string;
  };
  similarity: number;
}

export interface RAGResponse {
  answer: string;
  sources: Source[];
}

export interface SearchQuery {
  query: string;
  k?: number;
} 