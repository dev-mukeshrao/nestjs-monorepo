import { UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';


const UPLOADS_PATH = path.resolve(process.cwd(), 'uploads');

if (!fs.existsSync(UPLOADS_PATH)) {
  fs.mkdirSync(UPLOADS_PATH, { recursive: true });
}

export function CustomDocumentInterceptor(fieldName: string) {
  return UseInterceptors(
    FilesInterceptor(fieldName, 10, {
      storage: diskStorage({
        destination: (_req, _file, cb) => cb(null, UPLOADS_PATH), 
        filename: (_req, file, cb) => cb(null, generateCustomFilename(file.originalname)),
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, 
    })
  );
}

export function generateCustomFilename(originalname: string): string {
  const name = path.basename(originalname, path.extname(originalname)).replace(/\s+/g, '_');
  const ext = path.extname(originalname);
  return `${name}-${Date.now()}${ext}`;
}
