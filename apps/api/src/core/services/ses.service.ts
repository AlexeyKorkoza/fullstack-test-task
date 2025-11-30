import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import { SendTemplatedEmailCommand, SESClient } from '@aws-sdk/client-ses';

@Processor('email')
@Injectable()
export class SesService extends WorkerHost {
  sesClient: SESClient;

  constructor(private readonly configService: ConfigService) {
    super();
    const awsRegion = this.configService.get<string>('aws.region');
    this.sesClient = new SESClient({ region: awsRegion });
  }

  async process(job: Job): Promise<void> {
    try {
      const { name, data } = job;

      switch (name) {
        case 'sendWelcomeEmail': {
          const command = new SendTemplatedEmailCommand(data);
          await this.sesClient.send(command);
          break;
        }
      }
    } catch (error) {
      Logger.error('SesService - process', error);
    }
  }
}
