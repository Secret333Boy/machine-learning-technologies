import { BadRequestException, Injectable } from '@nestjs/common';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { OllamaEmbeddings } from '@langchain/ollama';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenTextSplitter } from '@langchain/textsplitters';
import { randomUUID } from 'crypto';
import { Prisma } from 'prisma/generated-client';

@Injectable()
export class VectorizerService {
  private static readonly MAX_CHUNK_SIZE = 2000;
  private static readonly CHUNK_OVERLAP = 500;
  private static readonly ACCEPTABLE_MIME_TYPES = [
    'application/pdf',
    'text/text',
  ];

  private readonly embeddings = new OllamaEmbeddings({
    model: 'bge-m3',
    maxRetries: 2,
    // truncate: true,
  });

  private readonly tokenizer = new TokenTextSplitter({
    chunkSize: VectorizerService.MAX_CHUNK_SIZE,
    chunkOverlap: VectorizerService.CHUNK_OVERLAP,
  });

  constructor(private readonly prisma: PrismaService) {}

  private async loadPdfFromBuffer(file: Express.Multer.File) {
    const loader = new PDFLoader(
      new Blob([file.buffer], { type: file.mimetype }),
      { splitPages: false },
    );

    const docs = await loader.load();

    return docs[0].pageContent;
  }

  public async addDocument(file: Express.Multer.File) {
    console.log('Adding file...');

    let text = '';
    switch (file.mimetype) {
      case 'application/pdf':
        text = await this.loadPdfFromBuffer(file);
        break;
      case 'text/plain':
        text = file.buffer.toString();
        break;
      default:
        throw new BadRequestException(
          `Only ${VectorizerService.ACCEPTABLE_MIME_TYPES.toString()} mimetype allowed`,
        );
    }

    const chunks = await this.tokenizer.splitText(text);
    const vectors = await this.embeddings.embedDocuments(chunks);

    const valuesListSqlPart = chunks.map(
      (_, i) =>
        Prisma.sql`(${randomUUID()},${chunks[i]}, ${'[' + vectors[i].toString() + ']'}::vector)`,
    );

    await this.prisma
      .$queryRaw`INSERT INTO "DocumentChunk" (id, content, vector) VALUES ${Prisma.join(valuesListSqlPart)}`;
  }

  public async query() {}
}
