// src/core/sessions/sessions.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryTranslation } from './entities/category-translation.entity';
import { Session } from './entities/session.entity';
import { SessionTranslation } from './entities/session-translation.entity';
import { CategoryService } from './services/category.service';
import { SessionService } from './services/session.service';
import { CategoryController } from './controllers/category.controller';
import { SessionController } from './controllers/session.controller';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryTranslationRepository } from './repositories/category-translation.repository';
import { SessionRepository } from './repositories/session.repository';
import { SessionTranslationRepository } from './repositories/session-translation.repository';
import { UserSessionsService } from './services/user-sessions.service';
import { UserSession } from './entities/user-session.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category, 
      CategoryTranslation, 
      Session, 
      SessionTranslation,
      UserSession
    ]),
    JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '60d' },
        }),
        inject: [ConfigService],
      }),
  ],
  controllers: [CategoryController, SessionController],
  providers: [
    CategoryService, 
    SessionService,
    CategoryRepository,
    CategoryTranslationRepository,
    SessionRepository,
    SessionTranslationRepository,
    UserSessionsService
  ],
  exports: [CategoryService, SessionService, UserSessionsService],
})
export class SessionsModule {}