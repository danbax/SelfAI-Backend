import { Controller, Get, Param, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { CreateChatDto } from '../dto/create-chat.dto';
import { CreateMessageDto } from '../dto/create-message.dto';
import { ChatOwnershipGuard } from '../../../common/guards/chat-ownership.guard';
import { TokenValidationGuard } from '../../../common/guards/token-validation.guard';
import { UserRequest } from '../../../common/interfaces/user-request.interface';
import { PaginationDTO } from '../../../common/dto/pagination.dto';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':id')
  @UseGuards(TokenValidationGuard)
  async getChat(@Param('id') chatId: number) {
    return this.chatService.getChatWithMessages(chatId);
  }

  @Get()
  @UseGuards(TokenValidationGuard)
  async getAllChats(
    @Req() req: UserRequest,
    @Query() paginationDto: PaginationDTO,
    @Query('search') search?: string,
    @Query('finished') finished?: boolean
  ) {
    const userId = req.user.id;
    return this.chatService.getAllChats(userId, paginationDto, search, finished);
  }

  @Post('create')
  @UseGuards(TokenValidationGuard)
  async startNewChat(
    @Req() req: UserRequest,
    @Body() createChatDto: CreateChatDto
  ) {
    const userId = req.user.id;
    createChatDto.userId = userId;
    return this.chatService.createNewChat(createChatDto);
  }

  @Post('messages/add')
//  @UseGuards(TokenValidationGuard, ChatOwnershipGuard)
  async addMessageToChat(
    @Body() createMessageDto: CreateMessageDto
  ) {
    return this.chatService.addMessageToChat(createMessageDto);
  }
}