import { Module } from '@nestjs/common';
import { AssistantController } from './assistant.controller';
import { AssistantService } from './assistant.service';
import { VectorizerModule } from '../vectorizer/vectorizer.module';

@Module({
  imports: [VectorizerModule],
  controllers: [AssistantController],
  providers: [AssistantService],
})
export class AssistantModule {}
