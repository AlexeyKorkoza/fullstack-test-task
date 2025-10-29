import { type PipeTransform, type ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) {}

    transform(value: unknown, metadata: ArgumentMetadata) {
        try {
            const parsedValue = this.schema.parse(value);
            return parsedValue;
        } catch (error: any) {
            const message = error?.issues[0]?.message ?? 'Validation failed';
            throw new BadRequestException(message);
        }
    }
}
