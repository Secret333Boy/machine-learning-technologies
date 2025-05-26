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
    template: `Answer user's question based on context below, don't use other sources. If you don't know the answer - just say you don't know.
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

    const chunks = await this.vectorizerService.query(question, 100);
    const context = chunks.map((chunk) => chunk.content).join('\n\n');

    const prompt = await this.template.format({ question, context });

    const result = await model.invoke(prompt);

    return result.content;
  }
}
