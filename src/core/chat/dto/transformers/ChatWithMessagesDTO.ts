import { IsNumber, IsString, IsDate, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MessageDto {
  @IsNumber()
  id: number;

  @IsNumber()
  chatId: number;

  @IsString()
  role: 'system' | 'user' | 'assistant';

  @IsString()
  message: string;

  @IsDate()
  createDate: Date;

  @IsDate()
  updateDate: Date;
}

class SimplifiedSessionDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;
}

export class ChatWithMessagesDto {
  @IsNumber()
  id: number;

  @IsNumber()
  userId: number;

  @IsDate()
  createDate: Date;

  @IsBoolean()
  finished: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages: MessageDto[];

  @ValidateNested()
  @Type(() => SimplifiedSessionDto)
  session: SimplifiedSessionDto;

  constructor(partial: Partial<ChatWithMessagesDto>) {
    Object.assign(this, partial);
  }
}