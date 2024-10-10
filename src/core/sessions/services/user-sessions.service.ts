// src/core/user-sessions/user-sessions.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSession } from '../entities/user-session.entity';

@Injectable()
export class UserSessionsService {
  constructor(
    @InjectRepository(UserSession)
    private userSessionRepository: Repository<UserSession>,
  ) {}

  async getUserSessions(userId: number): Promise<UserSession[]> {
    return this.userSessionRepository.find({ where: { userId } });
  }

  async completeSession(userId: number, sessionId: number): Promise<UserSession> {
    let userSession = await this.userSessionRepository.findOne({
      where: { userId, sessionId },
    });

    if (!userSession) {
      userSession = this.userSessionRepository.create({ userId, sessionId, completed: true });
    } else {
      userSession.completed = true;
    }

    return this.userSessionRepository.save(userSession);
  }
}