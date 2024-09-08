import { Column } from 'typeorm';

export class Goal {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  deadline: Date;

  @Column()
  completed: boolean;
}
