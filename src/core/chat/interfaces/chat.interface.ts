import { Message } from '../entities/message.entity';
import { CreateChatDto } from '../dto/create-chat.dto';
import { Chat } from '../entities/chat.entity';
import { SessionTransferDto } from '../dto/transformers/SessionTransferDto';

export interface IChat {
  id: number;
  user_id: number;
  messages: Message[];
  finished: boolean;
}

export interface IChatService {
  getChatWithMessages(chatId: number): Promise<Chat | null>;
  getAllChats(userId: number, inished?: boolean): Promise<SessionTransferDto[]>;
  createNewChat(createChatDto: CreateChatDto): Promise<Chat>;
  
}

