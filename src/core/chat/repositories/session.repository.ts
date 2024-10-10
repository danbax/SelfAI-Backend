import { EntityRepository, Repository } from 'typeorm';
import { Session } from '../../sessions/entities/session.entity';

@EntityRepository(Session)
export class SessionRepository extends Repository<Session> {}
