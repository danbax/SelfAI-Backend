import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../entities/session.entity';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async findByCategoryId(categoryId: number): Promise<Session[]> {
    return this.sessionRepository
      .createQueryBuilder('session')
      .where('session.categoryId = :categoryId', { categoryId })
      .leftJoinAndSelect('session.translations', 'translation')
      .getMany();
  }

  async findByIdWithTranslations(sessionId: number): Promise<Session> {
    return this.sessionRepository
      .createQueryBuilder('session')
      .where('session.id = :sessionId', { sessionId })
      .leftJoinAndSelect('session.translations', 'translation')
      .getOne();
  }
}
