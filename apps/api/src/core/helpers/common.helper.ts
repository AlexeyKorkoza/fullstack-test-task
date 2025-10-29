import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonHelper {
  constructor() {}

  parseJSONSafe(jsonString: string): object | null {
    try {
      return JSON.parse(jsonString);
    } catch (err) {
      return null;
    }
  }
}
