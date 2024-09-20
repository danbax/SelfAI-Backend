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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category, 
      CategoryTranslation, 
      Session, 
      SessionTranslation
    ]),
  ],
  controllers: [CategoryController, SessionController],
  providers: [
    CategoryService, 
    SessionService,
    CategoryRepository,
    CategoryTranslationRepository,
    SessionRepository,
    SessionTranslationRepository,
  ],
  exports: [CategoryService, SessionService],
})
export class SessionsModule {}