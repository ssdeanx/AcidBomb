import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

// Helper to check if an object is like a ServiceError
function isServiceError(error: any): error is { message: string; code: string; name: string } {
  return typeof error === 'object' && error !== null && 'code' in error && 'message' in error && error.name === 'ServiceError';
}

// Helper to map ActionErrorCode to HttpStatus
function mapActionCodeToHttpStatus(code: string): HttpStatus {
  switch (code) {
    case 'AUTH_UNAUTHORIZED': return HttpStatus.UNAUTHORIZED;
    case 'AUTH_FORBIDDEN': return HttpStatus.FORBIDDEN;
    case 'VALIDATION_ERROR': return HttpStatus.BAD_REQUEST;
    case 'DB_NOT_FOUND': return HttpStatus.NOT_FOUND;
    case 'DB_CONFLICT': return HttpStatus.CONFLICT;
    case 'LLM_RATE_LIMIT': return HttpStatus.TOO_MANY_REQUESTS;
    case 'SERVICE_UNAVAILABLE': return HttpStatus.SERVICE_UNAVAILABLE;
    // Add mappings for other ActionErrorCodes
    case 'DB_ERROR':
    case 'AGENT_EXECUTION_FAILED':
    case 'AGENT_TOOL_FAILED':
    case 'LLM_ERROR':
    case 'TOOL_NETWORK_ERROR':
    case 'TOOL_INPUT_ERROR':
    case 'DB_PRISMA_UNKNOWN':
    case 'UNKNOWN_ERROR':
    default: return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

@Catch() // Catch all exceptions
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'UNKNOWN_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responsePayload = exception.getResponse();
      message = typeof responsePayload === 'string'
        ? responsePayload
        : (responsePayload as any)?.message || 'Http Exception';
      code = exception.constructor.name;
      this.logger.warn(`HttpException caught: ${status} ${message}`, exception.stack);
    } else if (isServiceError(exception)) {
      status = mapActionCodeToHttpStatus(exception.code);
      message = exception.message;
      code = exception.code;
      this.logger.error(`ServiceError caught: ${status} [${code}] ${message}`, (exception as any).stack);
    } else if (exception instanceof Error) {
      message = exception.message;
      code = exception.name || 'Error';
      this.logger.error(`Generic Error caught: ${status} [${code}] ${message}`, exception.stack);
    } else {
      this.logger.error(`Unknown exception caught:`, exception);
    }

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      errorCode: code,
      message: message,
    };

    // Ensure response is sent only once
    if (!response.headersSent) {
      httpAdapter.reply(response, responseBody, status);
    } else {
      this.logger.warn('Response headers already sent, cannot send error response.');
    }
  }
}
