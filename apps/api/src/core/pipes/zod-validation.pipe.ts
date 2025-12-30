import {
  type PipeTransform,
  type ArgumentMetadata,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  private readonly logger = new Logger(ZodValidationPipe.name);

  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);

      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        const firstIssue = error.issues?.[0];
        const message = firstIssue?.message ?? 'Validation failed';

        this.logger.debug(`Validation failed: ${message}`, {
          issues: error.issues,
          value,
        });

        throw new BadRequestException(message);
      }

      this.logger.error('Unexpected validation error', error);
      throw new BadRequestException('Validation failed');
    }
  }
}
