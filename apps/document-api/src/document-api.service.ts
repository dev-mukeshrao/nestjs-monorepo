import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
