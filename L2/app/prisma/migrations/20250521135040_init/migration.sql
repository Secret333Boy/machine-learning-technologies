
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "DocumentChunk" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "vector" vector,

    CONSTRAINT "DocumentChunk_pkey" PRIMARY KEY ("id")
);
