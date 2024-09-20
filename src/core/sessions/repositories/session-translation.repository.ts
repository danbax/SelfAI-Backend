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

  async findBySessionIdAndLanguage(sessionId: number, languageCode: string = 'english'): Promise<SessionTranslation[]> {
    return this.sessionTranslationRepository
      .createQueryBuilder('sessionTranslation')
      .where('sessionTranslation.sessionId = :sessionId', { sessionId })
      .andWhere('sessionTranslation.languageCode = :languageCode', {
        languageCode
      })
      .getMany();
  }

  async findByCategoryAndLanguage(categoryId: number, languageCode: string = 'english'): Promise<SessionTranslation[]> {
    return this.sessionTranslationRepository
      .createQueryBuilder('sessionTranslation')
      .leftJoin('sessionTranslation.session', 'session')
      .where('session.categoryId = :categoryId', { categoryId })
      .andWhere('sessionTranslation.languageCode = :languageCode', {
        languageCode
      })
      .getMany();
  }
}
