import { Pool } from 'pg';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Document } from '@langchain/core/documents';

interface SearchResult extends Document {
  similarity: number;
}

export class VectorStoreService {
  private pool: Pool;
  private embeddings: OpenAIEmbeddings;

  constructor(embeddings: OpenAIEmbeddings) {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    this.embeddings = embeddings;
    this.initializeDB();
  }

  private async initializeDB() {
    try {
      await this.pool.query(`
        CREATE EXTENSION IF NOT EXISTS vector;
        
        CREATE TABLE IF NOT EXISTS documents (
          id SERIAL PRIMARY KEY,
          content TEXT NOT NULL,
          embedding vector(1536),
          metadata JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS documents_embedding_idx 
        ON documents 
        USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 100);
      `);
      console.log('Database initialized successfully');
    } catch (error: any) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  async addDocument(content: string, metadata: Record<string, any> = {}): Promise<void> {
    try {
      // Generate embedding for the document content
      const embedding = await this.embeddings.embedQuery(content);
      
      // Format the embedding array as a string that pgvector expects
      const vectorString = `[${embedding.join(',')}]`;
      
      console.log('Adding document with metadata:', metadata);
      console.log('Vector string starts with:', vectorString.substring(0, 20) + '...');

      // Insert the document and its embedding into the database
      await this.pool.query(
        `INSERT INTO documents (content, embedding, metadata)
         VALUES ($1, $2, $3)`,
        [content, vectorString, metadata]
      );
    } catch (error: any) {
      console.error('Error adding document:', error);
      console.error('Error details:', {
        message: error.message,
        detail: error.detail,
        code: error.code
      });
      throw error;
    }
  }

  async similaritySearch(query: string, k: number = 3): Promise<SearchResult[]> {
    try {
      console.log('Starting similarity search for query:', query);
      const queryEmbedding = await this.embeddings.embedQuery(query);
      const vectorString = `[${queryEmbedding.join(',')}]`;
      console.log('Generated query embedding, first few values:', 
        queryEmbedding.slice(0, 5).map(v => v.toFixed(4))
      );
      
      // First, let's check if we can find any documents at all
      const countResult = await this.pool.query('SELECT COUNT(*) FROM documents');
      console.log('Total documents in database:', countResult.rows[0].count);
      
      // Use cosine similarity (1 - cosine distance)
      const result = await this.pool.query(
        `SELECT content, metadata, 
                1 - (embedding <=> $1::vector) as similarity
         FROM documents
         ORDER BY similarity DESC
         LIMIT $2`,
        [vectorString, k]
      );
      
      console.log('Found results:', result.rows.length);
      if (result.rows.length > 0) {
        console.log('First result similarity:', result.rows[0].similarity);
        console.log('First result content preview:', 
          result.rows[0].content.substring(0, 50) + '...'
        );
      }
      
      const searchResults: SearchResult[] = result.rows.map(row => ({
        pageContent: row.content,
        metadata: row.metadata,
        similarity: row.similarity
      }));
      
      console.log('Search results similarities:', 
        searchResults.map(r => ({
          similarity: r.similarity,
          contentPreview: r.pageContent.substring(0, 50) + '...'
        }))
      );
      
      return searchResults;
    } catch (error: any) {
      console.error('Error performing similarity search:', error);
      console.error('Error details:', {
        message: error.message,
        detail: error.detail,
        code: error.code,
        hint: error.hint
      });
      throw error;
    }
  }

  async deleteDocument(id: number): Promise<void> {
    try {
      await this.pool.query(
        'DELETE FROM documents WHERE id = $1',
        [id]
      );
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
}
