import { IsInt, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsInt()
  chat_id: number;

  @IsInt()
  user_id: number;

  @IsString()
  message: string;

  @IsString()
  role: string;
}