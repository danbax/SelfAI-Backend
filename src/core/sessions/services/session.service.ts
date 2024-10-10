// src/core/sessions/services/session.service.ts

import { Injectable } from '@nestjs/common';
import { SessionTranslationRepository } from '../repositories/session-translation.repository';
import { GetSessionsDto } from '../dto/get-sessions.dto';
import { UserSessionsService } from './user-sessions.service';

@Injectable()
export class SessionService {
  constructor(
    private readonly sessionTranslationRepository: SessionTranslationRepository,
    private readonly userSessionsService: UserSessionsService,
  ) {}

  async getSessions({ categoryId, languageCode }: GetSessionsDto, userId: number) {
    const sessions = await this.sessionTranslationRepository.findByCategoryAndLanguage(categoryId, languageCode);
    const userSessions = await this.userSessionsService.getUserSessions(userId);

    return sessions.map((session, index) => {
      const isCompleted = userSessions.some(us => us.sessionId === session.sessionId && us.completed);
      const isUnlocked = index === 0 || userSessions.some(us => us.sessionId === sessions[index - 1].sessionId && us.completed);
      return {
        ...session,
        isCompleted,
        isUnlocked,
      };
    });
  }
}