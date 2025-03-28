import express from 'express';
import { DocumentProcessor } from '../services/documentProcessor';
import { RAGService } from '../services/ragService';
import { LLMService } from '../services/llmService';

const router = express.Router();
const documentProcessor = new DocumentProcessor();
const ragService = new RAGService();
const llmService = new LLMService();

// Process a single document
router.post('/process', async (req, res) => {
  try {
    const { content, metadata } = req.body;
    const result = await documentProcessor.processDocument(content, metadata);
    res.json(result);
  } catch (error) {
    console.error('Error processing document:', error);
    res.status(500).json({ error: 'Failed to process document' });
  }
});

// Process multiple documents
router.post('/process-multiple', async (req, res) => {
  try {
    const { documents } = req.body;
    const results = await Promise.all(
      documents.map((doc: { content: string; metadata: any }) =>
        documentProcessor.processDocument(doc.content, doc.metadata)
      )
    );
    res.json(results);
  } catch (error) {
    console.error('Error processing documents:', error);
    res.status(500).json({ error: 'Failed to process documents' });
  }
});

// Search documents and generate response
router.post('/search', async (req, res) => {
  try {
    const { query, k } = req.body;
    const response = await ragService.query(query, k);
    res.json(response);
  } catch (error) {
    console.error('Error searching documents:', error);
    res.status(500).json({ error: 'Failed to search documents' });
  }
});

// Direct LLM query without RAG
router.post('/direct-query', async (req, res) => {
  try {
    const { query } = req.body;
    const response = await llmService.generateResponse(query, []);
    res.json({ answer: response.answer });
  } catch (error) {
    console.error('Error generating direct LLM response:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

export default router; 