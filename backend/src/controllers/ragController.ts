import { Request, Response } from 'express';
import { RAGService } from '../services/ragService';

interface QueryRequest {
  query: string;
  k?: number;
}

interface DocumentRequest {
  content: string;
  metadata?: Record<string, any>;
}

export class RAGController {
  private ragService: RAGService;

  constructor() {
    this.ragService = new RAGService();
  }

  async query(req: Request<{}, {}, QueryRequest>, res: Response) {
    try {
      const { query, k = 3 } = req.body;
      
      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }

      const response = await this.ragService.query(query, k);
      return res.json(response);
    } catch (error) {
      console.error('Error processing query:', error);
      return res.status(500).json({ 
        error: 'An error occurred while processing your query',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async addDocument(req: Request<{}, {}, DocumentRequest>, res: Response) {
    try {
      const { content, metadata } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: 'Document content is required' });
      }

      await this.ragService.addDocument(content);
      return res.json({ 
        message: 'Document added successfully',
        metadata: metadata || {}
      });
    } catch (error) {
      console.error('Error adding document:', error);
      return res.status(500).json({ 
        error: 'An error occurred while adding the document',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
