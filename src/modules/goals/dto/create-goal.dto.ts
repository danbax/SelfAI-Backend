import { IsString, IsNotEmpty, IsDate, IsBoolean } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsDate()
  deadline: Date;

  @IsBoolean()
  completed: boolean;
}
