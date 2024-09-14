// chat.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { ChatRepository } from '../repositories/chat.repository';

describe('ChatService', () => {
  let service: ChatService;
  let chatRepository: ChatRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: ChatRepository,
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    chatRepository = module.get<ChatRepository>(ChatRepository);
  });

  it('should return chat with messages', async () => {
    const mockChat = { id: 1, messages: [], sessionId: 1, userId: 1, finished: false, createDate: new Date() };
    jest.spyOn(chatRepository, 'findOne').mockResolvedValue(mockChat);
    const chat = await service.getChatWithMessages(1);
    expect(chat).toEqual(mockChat);
  });
});
