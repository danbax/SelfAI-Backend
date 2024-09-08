import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  log(message: string) {
    console.log(message);
  }
  error(message: string, trace: string) {
    console.error(message, trace);
  }
  warn(message: string) {
    console.warn(message);
  }
  debug(message: string) {
    console.debug(message);
  }
  verbose(message: string) {
    console.log(message);
  }
}
