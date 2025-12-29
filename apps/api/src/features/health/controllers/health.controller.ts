import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { RedisHealthIndicator } from '@/features/health/indicators/redis-health.indicator';
import { PrismaHealthIndicator } from '@/features/health/indicators/prisma-health.indicator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private prisma: PrismaHealthIndicator,
    private redis: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Health check passed',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok',
        },
        info: {
          type: 'object',
          properties: {
            memory_heap: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'up' },
              },
            },
            database: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'up' },
              },
            },
            redis: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'up' },
                message: { type: 'string', example: 'Redis is healthy' },
                responseTime: { type: 'string', example: 'ok' },
              },
            },
          },
        },
        error: {
          type: 'object',
          example: {},
        },
        details: {
          type: 'object',
          properties: {
            memory_heap: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'up' },
              },
            },
            database: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'up' },
              },
            },
            redis: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'up' },
                message: { type: 'string', example: 'Redis is healthy' },
                responseTime: { type: 'string', example: 'ok' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Health check failed',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'error',
        },
        info: {
          type: 'object',
        },
        error: {
          type: 'object',
          properties: {
            redis: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'down' },
                message: { type: 'string', example: 'Redis connection failed' },
              },
            },
          },
        },
        details: {
          type: 'object',
        },
      },
    },
  })
  check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.prisma.isHealthy('database'),
      () => this.redis.isHealthy('redis'),
    ]);
  }
}

