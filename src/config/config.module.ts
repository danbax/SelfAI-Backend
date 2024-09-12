import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';

interface AppConfig {
  port: number;
  jwtSecret: string;
  databaseUrl: string;
}

@Module({
  imports: [NestConfigModule.forRoot({isGlobal: true})],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
