import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalService } from './goal.service';
import { GoalController } from './goal.controller';
import { UserGoals } from './entities/user-goals.mongo-entity';
import { GoalRepository } from './repositories/goal.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserGoals])],
  providers: [GoalService, GoalRepository],
  controllers: [GoalController],
  exports: [GoalService],
})
export class GoalModule {}
