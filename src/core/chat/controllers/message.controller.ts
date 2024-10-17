// message.controller.ts
import { Controller, Post, Put, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { UpdateMessageDto } from '../dto/update-message.dto';
import { CreateMessageDto } from '../dto/create-message.dto';
import { TokenValidationGuard } from 'src/common/guards/token-validation.guard';
import { UserRequest } from '../../../common/interfaces/user-request.interface';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send')
  @UseGuards(TokenValidationGuard)
  async addMessage(
    @Req() req: UserRequest,
    @Body() createMessageDto: CreateMessageDto
  ) {
    const userId = req.user.id;
    return this.messageService.addMessage(createMessageDto, userId);
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