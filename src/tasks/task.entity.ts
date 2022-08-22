import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TasksStatus } from './task.enum';
import { User } from '../auth/user.entity';
import {Exclude} from "class-transformer";

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  status: TasksStatus;
  @ManyToOne((_type) => User, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
