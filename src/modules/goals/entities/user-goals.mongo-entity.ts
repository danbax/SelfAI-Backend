import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { Goal } from './goal.mongo-entity';
import { ObjectId } from 'mongodb';

@Entity('user_goals')
export class UserGoals {
  @ObjectIdColumn()
  userId: ObjectId;

  @Column(type => Goal)
  goals: Goal[];
}
