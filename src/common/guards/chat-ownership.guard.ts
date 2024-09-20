import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from '../../core/chat/entities/chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatOwnershipGuard implements CanActivate {

  constructor(
    @InjectRepository(Chat) 
    private readonly chatRepository: Repository<Chat>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const chatId = request.params.chatId;

    const isOwner = await this.isChatOwner(chatId, userId);
    if (!isOwner) {
      throw new ForbiddenException('You do not have access to this chat');
    }

    return true;
  }

  async isChatOwner(chatId: number, userId: number): Promise<boolean> {
    const chat = await this.chatRepository.findOne({ where: { id: chatId } });
    if (!chat) throw new NotFoundException('Chat not found');
    return chat.userId === userId;
  }
}
