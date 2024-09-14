import { IsInt, IsOptional } from 'class-validator';

export class CreateChatDto {
  @IsInt()
  user_id: number;

  @IsInt()
  session_id: number;

  @IsOptional()
  finished?: boolean;
}