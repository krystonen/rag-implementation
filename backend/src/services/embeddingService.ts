import { OpenAIEmbeddings } from '@langchain/openai';

export class EmbeddingService {
  private embeddings: OpenAIEmbeddings;

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }

  async embedQuery(query: string): Promise<number[]> {
    return this.embeddings.embedQuery(query);
  }

  async embedDocuments(documents: string[]): Promise<number[][]> {
    return this.embeddings.embedDocuments(documents);
  }
}
