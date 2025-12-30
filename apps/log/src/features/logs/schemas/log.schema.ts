import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument } from 'mongoose';

import { SendLogTypeEnum } from '@repo/api';

export type LogDocument = HydratedDocument<Log>;

@Schema()
export class Log {
  @Prop({ default: '' })
  endpoint: string;

  @Prop({ type: Object, default: {} })
  data: Record<string, any>;

  @Prop({ required: true })
  message: string;

  @Prop({
    required: true,
    enum: [
      SendLogTypeEnum.success,
      SendLogTypeEnum.error,
      SendLogTypeEnum.warning,
      SendLogTypeEnum.info,
      SendLogTypeEnum.debug,
      SendLogTypeEnum.verbose,
    ],
  })
  type: string;

  @Prop({ default: Date.now() })
  createdAt: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
