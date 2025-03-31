import { OpenAIEmbeddings } from '@langchain/openai';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { VectorStoreService } from './vectorStoreService';
import { LLMService } from './llmService';
import { Document } from '@langchain/core/documents';

interface RAGResponse {
  answer: string;
  sources: Array<{
    content: string;
    metadata: Record<string, any>;
    similarity: number;
  }>;
}

export class RAGService {
  private embeddings: OpenAIEmbeddings;
  private model: ChatOpenAI;
  private vectorStore: VectorStoreService;
  private prompt: PromptTemplate;
  private llmService: LLMService;

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    this.model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-3.5-turbo',
      temperature: 0.7,
    });

    this.vectorStore = new VectorStoreService(this.embeddings);
    this.llmService = new LLMService();

    this.prompt = PromptTemplate.fromTemplate(`
      Answer the question based on the following context:
      
      Context: {context}
      
      Question: {question}
      
      Answer: `);
  }

  async query(query: string, k: number = 3): Promise<RAGResponse> {
    try {
      // Log only non-sensitive information
      console.log('Starting RAG query process');
      
      // Retrieve relevant documents
      console.log('Retrieving relevant documents...');
      const relevantDocs = await this.vectorStore.similaritySearch(query, k);
      console.log('Retrieved documents:', {
        count: relevantDocs.length,
        averageSimilarity: relevantDocs.reduce((acc, doc) => acc + doc.similarity, 0) / relevantDocs.length
      });
      
      // Generate response using LLM
      console.log('Generating response using LLM...');
      const response = await this.llmService.generateResponse(query, relevantDocs);
      console.log('Response generated successfully');
      
      return {
        answer: response.answer,
        sources: response.sources.map(source => ({
          content: source.content,
          metadata: source.metadata,
          similarity: source.similarity
        }))
      };
    } catch (error) {
      // Log error without sensitive information
      console.error('Error in RAG query:', {
        errorType: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async addDocument(content: string, metadata: Record<string, any> = {}): Promise<void> {
    try {
      console.log('Adding document to vector store...');
      await this.vectorStore.addDocument(content, metadata);
      console.log('Document added successfully');
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }
}
