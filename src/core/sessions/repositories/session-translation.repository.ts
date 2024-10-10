// src/core/sessions/repositories/session-translation.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionTranslation } from '../entities/session-translation.entity';

@Injectable()
export class SessionTranslationRepository {
  constructor(
    @InjectRepository(SessionTranslation)
    private readonly sessionTranslationRepository: Repository<SessionTranslation>,
  ) {}

  async findByCategoryAndLanguage(categoryId: number, languageCode: string = 'english'): Promise<SessionTranslation[]> {
    return this.sessionTranslationRepository
      .createQueryBuilder('sessionTranslation')
      .innerJoin('sessionTranslation.session', 'session')
      .select([
        'sessionTranslation.id as id',
        'sessionTranslation.title as title',
        'sessionTranslation.text as text',
        'sessionTranslation.languageCode as language',
        'session.id AS sessionId',
      ])
      .where('session.categoryId = :categoryId', { categoryId })
      .andWhere('sessionTranslation.languageCode = :languageCode', { languageCode })
      .orderBy('session.id', 'ASC')
      .getRawMany();
  }
}