import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { Document } from '@langchain/core/documents';

interface LLMResponse {
  answer: string;
  sources: Array<{
    content: string;
    metadata: Record<string, any>;
    similarity: number;
  }>;
}

export class LLMService {
  private model: ChatOpenAI;
  private prompt: PromptTemplate;

  constructor() {
    // Initialize the LLM model
    this.model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-3.5-turbo',
      temperature: 0.7,
    });

    // Create a prompt template for generating responses
    this.prompt = PromptTemplate.fromTemplate(`
      You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
      If you don't know the answer, just say that you don't know, don't try to make up an answer.
      If the question is not related to the context, politely respond that you are tuned to only answer questions about the provided context.

      Context:
      {context}

      Question: {question}

      Answer: `);
  }

  async generateResponse(
    query: string,
    relevantDocs: Array<Document & { similarity: number }>
  ): Promise<LLMResponse> {
    try {
      console.log('Generating response with documents:', 
        relevantDocs.map(doc => ({
          content: doc.pageContent.substring(0, 50) + '...',
          similarity: doc.similarity
        }))
      );

      // Combine all relevant documents into a single context
      const context = relevantDocs
        .map(doc => doc.pageContent)
        .join('\n\n');

      // Create the chain
      const chain = RunnableSequence.from([
        {
          context: (input: any) => input.context,
          question: (input: any) => input.question,
        },
        this.prompt,
        this.model,
        new StringOutputParser(),
      ]);

      // Generate the response
      const answer = await chain.invoke({
        context,
        question: query,
      });

      // Return the response with sources
      const response: LLMResponse = {
        answer,
        sources: relevantDocs.map(doc => ({
          content: doc.pageContent,
          metadata: doc.metadata,
          similarity: doc.similarity
        }))
      };

      console.log('+++++++++++++++++++Generated response with sources:', {
        answerLength: response.answer.length,
        sourcesCount: response.sources.length,
        firstSourceSimilarity: response.sources[0]?.similarity
      });

      return response;
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }
} 