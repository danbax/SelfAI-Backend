import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { UserGoals } from './entities/user-goals.mongo-entity';
import { Goal } from './entities/goal.mongo-entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(UserGoals, 'mongodbConnection')
    private readonly userGoalsRepository: Repository<UserGoals>,
  ) {}

  async addGoal(
    userId: string,
    createGoalDto: CreateGoalDto,
  ): Promise<UserGoals> {
    const userObjectId = new ObjectId(userId);
    let userGoals = await this.userGoalsRepository.findOne({
      where: { userId: userObjectId },
    });
    if (!userGoals) {
      userGoals = this.userGoalsRepository.create({
        userId: userObjectId,
        goals: [],
      });
    }
    userGoals.goals.push(createGoalDto as Goal);
    return this.userGoalsRepository.save(userGoals);
  }

  async getGoals(userId: string): Promise<Goal[]> {
    const userObjectId = new ObjectId(userId);
    const userGoals = await this.userGoalsRepository.findOne({
      where: { userId: userObjectId },
    });
    if (userGoals) {
      return userGoals.goals;
    } else {
      throw new Error('User not found');
    }
  }

  async updateGoal(
    userId: string,
    goalIndex: number,
    updateGoalDto: UpdateGoalDto,
  ): Promise<UserGoals> {
    const userObjectId = new ObjectId(userId);
    const userGoals = await this.userGoalsRepository.findOne({
      where: { userId: userObjectId },
    });
    if (userGoals && userGoals.goals[goalIndex]) {
      userGoals.goals[goalIndex] = {
        ...userGoals.goals[goalIndex],
        ...updateGoalDto,
      };
      return this.userGoalsRepository.save(userGoals);
    } else {
      throw new Error('User or Goal not found');
    }
  }

  async deleteGoal(userId: string, goalIndex: number): Promise<UserGoals> {
    const userObjectId = new ObjectId(userId);
    const userGoals = await this.userGoalsRepository.findOne({
      where: { userId: userObjectId },
    });
    if (userGoals && userGoals.goals[goalIndex]) {
      userGoals.goals.splice(goalIndex, 1);
      return this.userGoalsRepository.save(userGoals);
    } else {
      throw new Error('User or Goal not found');
    }
  }
}
