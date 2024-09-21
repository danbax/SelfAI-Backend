import { Injectable } from '@nestjs/common';
import { SessionTranslationRepository } from '../repositories/session-translation.repository';
import { GetSessionsDto } from '../dto/get-sessions.dto';

@Injectable()
export class SessionService {
  constructor(
    private readonly sessionTranslationRepository: SessionTranslationRepository,
  ) {}

  async getSessions({ categoryId, languageCode }: GetSessionsDto) {
    return this.sessionTranslationRepository.findByCategoryAndLanguage(categoryId, languageCode);
  }
}