import { Provider } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe';

export const ValidationProvider: Provider = {
  provide: APP_PIPE,
  useClass: ZodValidationPipe,
};
