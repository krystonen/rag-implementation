import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Document } from '@langchain/core/documents';
import { VectorStoreService } from './vectorStoreService';

interface ProcessedDocument {
  content: string;
  chunks: Document[];
  metadata: Record<string, any>;
}

export class DocumentProcessor {
  private textSplitter: RecursiveCharacterTextSplitter;
  private embeddings: OpenAIEmbeddings;
  public vectorStore: VectorStoreService;

  constructor() {
    console.log('Initializing DocumentProcessor...');
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,        // Size of each text chunk
      chunkOverlap: 200,      // Number of characters to overlap between chunks
      lengthFunction: (text) => text.length,
      separators: ["\n\n", "\n", " ", ""], // Order of separators to try
    });

    console.log('Initializing OpenAI embeddings...');
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    console.log('Initializing VectorStore...');
    this.vectorStore = new VectorStoreService(this.embeddings);
  }

  async processDocument(
    text: string, 
    metadata: Record<string, any> = {}
  ): Promise<ProcessedDocument> {
    try {
      console.log('Processing document...');
      console.log('Document metrics:', {
        textLength: text.length,
        metadataKeys: Object.keys(metadata)
      });
      
      // Split the text into chunks
      const chunks = await this.textSplitter.createDocuments([text]);
      console.log('Document processing:', {
        chunkCount: chunks.length,
        averageChunkSize: chunks.reduce((acc, chunk) => acc + chunk.pageContent.length, 0) / chunks.length
      });
      
      // Process each chunk and store in vector database
      for (const chunk of chunks) {
        await this.vectorStore.addDocument(chunk.pageContent, {
          ...metadata,
          chunkIndex: chunks.indexOf(chunk),
          totalChunks: chunks.length,
        });
      }

      return {
        content: text,
        chunks,
        metadata,
      };
    } catch (error) {
      // Log error without sensitive information
      console.error('Error processing document:', {
        errorType: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async processDocuments(
    texts: string[],
    metadata: Record<string, any> = {}
  ): Promise<ProcessedDocument[]> {
    try {
      const processedDocs = await Promise.all(
        texts.map(text => this.processDocument(text, metadata))
      );
      return processedDocs;
    } catch (error) {
      console.error('Error processing documents:', error);
      throw error;
    }
  }
} 