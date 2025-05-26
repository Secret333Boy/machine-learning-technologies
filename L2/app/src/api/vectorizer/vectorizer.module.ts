import { Module } from '@nestjs/common';
import { VectorizerController } from './vectorizer.controller';
import { VectorizerService } from './vectorizer.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VectorizerController],
  providers: [VectorizerService],
  exports: [VectorizerService],
})
export class VectorizerModule {}
