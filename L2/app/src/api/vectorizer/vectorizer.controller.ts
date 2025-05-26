import {
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
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

  @Get('/query')
  public async query(
    @Query('search') search: string,
    @Query('take', ParseIntPipe) take: number,
    @Query('skip', ParseIntPipe) skip: number,
  ) {
    return this.vectorizerService.query(search, take, skip);
  }
}
