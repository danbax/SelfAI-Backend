import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { I18nService } from 'nestjs-i18n';

@Controller('users/:userId/goals')
export class GoalController {
  constructor(
    private readonly goalService: GoalService,
    private readonly i18n: I18nService
  ) {}

  @Post()
  create(
    @Param('userId') userId: string,
    @Body() createGoalDto: CreateGoalDto
  ) {
    return this.goalService.addGoal(userId, createGoalDto);
  }

  @Get()
  findAll(@Param('userId') userId: string) {
    return this.goalService.getGoals(userId);
  }

  @Put(':goalIndex')
  update(
    @Param('userId') userId: string,
    @Param('goalIndex') goalIndex: number,
    @Body() updateGoalDto: UpdateGoalDto
  ) {
    return this.goalService.updateGoal(userId, goalIndex, updateGoalDto);
  }

  @Delete(':goalIndex')
  remove(
    @Param('userId') userId: string,
    @Param('goalIndex') goalIndex: number
  ) {
    return this.goalService.deleteGoal(userId, goalIndex);
  }
}
