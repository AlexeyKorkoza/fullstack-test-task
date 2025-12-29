import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof message === 'string'
          ? message
          : (message as { message: string }).message || 'Internal server error',
    };

    if (status >= 500) {
      this.logger.error(
        `HTTP ${status} Error: ${errorResponse.message}`,
        exception instanceof Error ? exception.stack : undefined,
        `${request.method} ${request.url}`,
      );
    } else {
      this.logger.warn(
        `HTTP ${status} Error: ${errorResponse.message}`,
        `${request.method} ${request.url}`,
      );
    }

    response.status(status).json(errorResponse);
  }
}

