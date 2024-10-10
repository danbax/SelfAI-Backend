// message.controller.ts
import { Controller, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { Message } from '../entities/message.entity';
import { UpdateMessageDto } from '../dto/update-message.dto';
import { CreateMessageDto } from '../dto/create-message.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send')
  async addMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.addMessage(createMessageDto);
  }

  @Put(':id')
  async editMessage(@Param('id') messageId: number, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.updateMessage(messageId, updateMessageDto);
  }

  @Delete(':id')
  async deleteMessage(@Param('id') messageId: number) {
    return this.messageService.deleteMessage(messageId);
  }
}