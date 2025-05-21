import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VectorizerService } from './vectorizer.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('vectorizer')
export class VectorizerController {
  constructor(private readonly vectorizerService: VectorizerService) {}

  @Post('/add_document')
  @UseInterceptors(FileInterceptor('file'))
  public async addDocument(@UploadedFile() file: Express.Multer.File) {
    return this.vectorizerService.addDocument(file);
  }

  @Post('/query')
  public async query() {
    return this.vectorizerService.query();
  }
}
