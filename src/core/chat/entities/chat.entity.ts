import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToMany } from 'typeorm';
import { Message } from './message.entity';

@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sessionId: number;

  @Column()
  userId: number;

  @Column()
  createDate: Date;

  @OneToMany(() => Message, message => message.chat)
  messages: Message[];

  @Column({ default: false })
  finished: boolean;
}
