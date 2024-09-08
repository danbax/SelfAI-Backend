import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.mysql-entity';

@EntityRepository(User)
export class GoalRepository extends Repository<User> {}
