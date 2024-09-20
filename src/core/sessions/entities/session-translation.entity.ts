import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Session } from './session.entity';

@Entity('session_translations')
export class SessionTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 5 })
  languageCode: string;

  @Column('text')
  title: string;

  @Column('text')
  text: string;

  /**
  @ManyToOne(() => Session, (session) => session.translations)
  @JoinColumn({ name: 'sessionId' })
  session: Session;
  **/
}