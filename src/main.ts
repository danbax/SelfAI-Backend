import './polyfill';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './common/logger/logger.service';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new LoggerService();

  
  app.enableCors({
    origin: ['http://localhost:5173', 'http://192.168.178.118:5173', '192.168.178.118:5173',
      'http://localhost:5174', 'http://192.168.178.118:5174', '192.168.178.118:5174', '*', '192.168.178.118:5173'
    ],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(logger);
  app.useGlobalInterceptors(new ResponseInterceptor());

  const port = configService.get<number>('PORT', 3000);
  app.listen(port, '0.0.0.0', () => {
    console.log('Server is running on port 3000');
  });
}
bootstrap();
