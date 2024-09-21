import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Session } from './session.entity';

@Entity('session_translations')
export class SessionTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'language_code' })
  languageCode: string;

  @Column('text')
  title: string;

  @Column('text')
  text: string;

  @Column({ name: 'session_id' })
  sessionId: number;

  @ManyToOne(() => Session, (session) => session.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: Session;
}