// chat.controller.ts
import { Controller, Get, Param, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { CreateChatDto } from '../dto/create-chat.dto';
import { ChatOwnershipGuard } from '../../../common/guards/chat-ownership.guard';
import { TokenValidationGuard } from '../../../common/guards/token-validation.guard';
import { UserRequest } from '../../../common/interfaces/user-request.interface';
import { JwtService } from '@nestjs/jwt';
import { CreateMessageDto } from '../dto/create-message.dto';

@Controller('chats')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService
) {}

  @Get(':id')
  @UseGuards(TokenValidationGuard, ChatOwnershipGuard)
  async getChat(@Param('id') chatId: number) {
    return this.chatService.getChatWithMessages(chatId);
  }

  @Post()
  @UseGuards(TokenValidationGuard)
  async getAllChats(@Req() req: UserRequest, @Body('finished') finished?: boolean) {
    const userId = req.user.id;
    return this.chatService.getAllChats(userId, finished);
  }

  @Post()
  @UseGuards(TokenValidationGuard)
  async startNewChat(@Body() createChatDto: CreateChatDto) {
    return this.chatService.createNewChat(createChatDto);
  }

  @Post()
  @UseGuards(TokenValidationGuard)
  async addMessageToChat(@Body() createMessageDto: CreateMessageDto) {
    return this.chatService.addMessageToChat(createMessageDto);
  }
}