import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../entities/session.entity';
import { SessionTranslation } from '../entities/session-translation.entity';
import { SessionTranslationRepository } from '../repositories/session-translation.repository';
import { GetSessionsDto } from '../dto/get-sessions.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session) 
    private readonly sessionRepository: Repository<Session>,
    private readonly sessionTranslationRepository: SessionTranslationRepository,
  ) {}

  async getSessions({ categoryId, languageCode }: GetSessionsDto) {
    return this.sessionTranslationRepository.findByCategoryAndLanguage(categoryId, languageCode);
  }
}
