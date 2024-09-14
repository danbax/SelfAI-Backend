import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';

export interface IMessage {
  id: number;
  chat_id: number;
  message: string;
  role: string;
}

export interface IMessageService {
  addMessage(createMessageDto: CreateMessageDto): Promise<IMessage>;
  updateMessage(id: number, updateMessageDto: UpdateMessageDto): Promise<IMessage | null>;
  deleteMessage(id: number): Promise<void>;
}