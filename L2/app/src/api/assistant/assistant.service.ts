import { ChatOllama, OllamaEmbeddings } from '@langchain/ollama';
import { Injectable } from '@nestjs/common';
import { HumanMessage, BaseMessage } from '@langchain/core/messages';
import z from 'zod';

const outputSchema = z.object({
  thinking: z.string().describe('Thinking'),
  answer: z.string().describe('The answer'),
  rating: z.number().describe('How good answer is, from 1 to 10'),
});

@Injectable()
export class AssistantService {
  public async query() {
    const model = new ChatOllama({
      model: 'qwen3:14b',
      streaming: true,
    });

    const chunks: string[] = [];
    let thinking = false;

    const messages: BaseMessage[] = [
      new HumanMessage('What is the black hole?'),
    ];

    let result = await model.invoke(messages);
    messages.push(result);

    messages.push(
      new HumanMessage('What are the difference between black and white ones?'),
    );

    result = await model.invoke(messages);
    console.log(result.content);
  }
}
