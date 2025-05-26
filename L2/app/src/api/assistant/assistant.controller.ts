import { Controller, Get, Post, Query } from '@nestjs/common';
import { AssistantService } from './assistant.service';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get('/query')
  public async query(@Query('question') question: string) {
    return this.assistantService.query(question);
  }
}
