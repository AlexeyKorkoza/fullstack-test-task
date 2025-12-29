import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';

import { SendLogTypeEnum, type SignUpRequestDto } from '@repo/api';
import { LogService } from '@/core/services/log.service';
import { type AppConfig } from '@/core/interfaces';

@Injectable()
export class EmailService {
  private readonly verifiedEmail: string = '';

  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
    private readonly configService: ConfigService<AppConfig>,
    private readonly logService: LogService,
  ) {
    this.verifiedEmail = this.configService.get<string>('aws.verifiedEmail', { infer: true });
  }

  async sendWelcomeEmail(data: SignUpRequestDto): Promise<void> {
    if (!this.verifiedEmail) {
      this.logService.sendLog({
        endpoint: '/auth/register',
        message: 'Verified email is not set',
        type: SendLogTypeEnum.error,
      });
      throw new Error('Verified email is not set');
    }

    const input = {
      Destination: { ToAddresses: [data.email] },
      Source: this.verifiedEmail,
      Template: 'sendWelcomeEmail',
      TemplateData: JSON.stringify({ contact: { email: data.email } }),
    };

    await this.emailQueue.add('sendWelcomeEmail', input);
  }
}
