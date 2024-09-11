import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HttpRequest');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();

    this.logger.log(`Incoming request: ${method} ${originalUrl}`);

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      statusCode.toString().startsWith('5')
        ? this.logger.error(
            `Request completed: ${method} ${originalUrl} - ${res.statusCode} (${duration}ms)`,
          )
        : this.logger.log(
            `Request completed: ${method} ${originalUrl} - ${res.statusCode} (${duration}ms)`,
          );
    });

    next();
  }
}
