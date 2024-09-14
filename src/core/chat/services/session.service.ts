import { Injectable } from '@nestjs/common';
import { SessionRepository } from '../repositories/session.repository';
import { CreateSessionDto } from '../dto/create-session.dto';
import { Session } from '../entities/session.entity';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session) private readonly sessionRepository: Repository<Session>
  ) {}

  async createSession(createSessionDto: CreateSessionDto): Promise<Session> {
    const session = this.sessionRepository.create(createSessionDto);
    return this.sessionRepository.save(session);
  }

  async findAllSessions(page?: number, limit?: number): Promise<Session[]> {
    const options: FindManyOptions<Session> = {};

    if (page && limit) {
      options.skip = (page - 1) * limit;
      options.take = limit;
    }

    return this.sessionRepository.find(options);
  }

  async findSessionsByCategory(category: string, page?: number, limit?: number): Promise<Session[]> {
    const options: FindManyOptions<Session> = {
      where: { category },
    };

    if (page && limit) {
      options.skip = (page - 1) * limit;
      options.take = limit;
    }

    return this.sessionRepository.find(options);
  }

  async findSessionById(id: number): Promise<Session> {
    const options: FindOneOptions<Session> = {
      where: { id },
    };

    return this.sessionRepository.findOne(options);
  }
}
