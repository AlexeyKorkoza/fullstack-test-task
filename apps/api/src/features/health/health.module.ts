import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { CoreModule } from '@/core/core.module';
import { HealthController } from '@/features/health/controllers/health.controller';
import { RedisHealthIndicator } from '@/features/health/indicators/redis-health.indicator';
import { PrismaHealthIndicator } from '@/features/health/indicators/prisma-health.indicator';

@Module({
  imports: [TerminusModule, CoreModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator, RedisHealthIndicator],
})
export class HealthModule {}

