import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true, name: 'first_name' })
  firstName: string;

  @Column({ nullable: true, name: 'last_name' })
  lastName: string;

  @Column({ nullable: true, type: 'date', name: 'birth_date' })
  birthDate: Date;

  @Column({ default: false, name: 'dark_mode' })
  darkMode: boolean;

  @Column({ nullable: true, name: 'pin_code' })
  pinCode: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}