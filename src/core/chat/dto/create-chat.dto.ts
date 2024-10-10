import { IsInt, IsOptional } from 'class-validator';

export class CreateChatDto {
  @IsInt()
  @IsOptional()
  userId: number;

  @IsInt()
  sessionId: number;

  @IsOptional()
  finished?: boolean;
}