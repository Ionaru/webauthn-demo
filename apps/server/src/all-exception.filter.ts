import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    // const request = context.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : 500;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      // path: request.url,
      message: exception instanceof HttpException ? exception.getResponse() : 'Internal Server Error',
      stack: (exception as Error)?.stack || '',  // This will include the stack trace
    };

    response.status(status).json(errorResponse);
  }
}
