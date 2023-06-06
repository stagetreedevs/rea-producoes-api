/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async convert(url: string): Promise<string> {
    return Promise.resolve(encodeURIComponent(url));
  }
  
}
