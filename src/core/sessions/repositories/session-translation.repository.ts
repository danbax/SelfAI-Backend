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
      .where('session.categoryId = :categoryId', { categoryId })
      .andWhere('sessionTranslation.languageCode = :languageCode', { languageCode })
      .getMany();
  }
}