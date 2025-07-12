import { Injectable } from '@nestjs/common';

@Injectable()
export class IngestionApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
