import { Module } from '@nestjs/common';
import { VectorizerModule } from './vectorizer/vectorizer.module';
import { AssistantModule } from './assistant/assistant.module';

@Module({
  imports: [VectorizerModule, AssistantModule],
})
export class ApiModule {}
