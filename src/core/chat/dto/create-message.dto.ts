import { IsInt, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsInt()
  chat_id: number;

  @IsString()
  message: string;

  role: 'user' | 'system' | 'assistant';
}