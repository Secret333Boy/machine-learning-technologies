import { ChatOllama } from '@langchain/ollama';
import { Injectable } from '@nestjs/common';
import { PromptTemplate } from '@langchain/core/prompts';
import { VectorizerService } from '../vectorizer/vectorizer.service';

// const outputSchema = z.object({
//   thinking: z.string().describe('Thinking'),
//   answer: z.string().describe('The answer'),
//   rating: z.number().describe('How good answer is, from 1 to 10'),
// });

@Injectable()
export class AssistantService {
  private readonly template = new PromptTemplate({
    template: `You are an assistant for Harry Potter books. Answer question based only on context below, don't use other sources. If you don't know the answer or answer is not given in context below - just say you don't know.
Context:
{context}
Question: {question}
Answer: `,
    inputVariables: ['context', 'question'],
  });

  constructor(private readonly vectorizerService: VectorizerService) {}

  public async query(question: string) {
    const model = new ChatOllama({
      model: 'qwen3:14b',
    });

    const chunks = await this.vectorizerService.query(question, 50);
    const context = chunks.map((chunk) => chunk.content).join('\n\n');

    const prompt = await this.template.format({ question, context });

    const result = await model.invoke(prompt);

    return result.content;
  }
}
