import { EntityRepository, Repository } from 'typeorm';
import { User } from '../../../core/users/entities/user.mysql-entity'

@EntityRepository(User)
export class GoalRepository extends Repository<User> {}
