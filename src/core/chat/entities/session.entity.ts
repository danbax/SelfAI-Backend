import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @Column()
  title: string;

  @Column('text')
  text: string;

  @Column('text')
  systemPrompt: string;
}
