import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Chat } from './chat.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chatId: number;

  @Column()
  role: 'user' | 'system' | 'assistant';

  @Column('text')
  message: string;

  @Column()
  createDate: Date;

  @Column()
  updateDate: Date;

  @ManyToOne(() => Chat, chat => chat.messages)
  chat: Chat;
}
