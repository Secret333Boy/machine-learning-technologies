import { Controller, Post } from '@nestjs/common';
import { AssistantService } from './assistant.service';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post('/query')
  public async query() {
    return this.assistantService.query();
  }
}
