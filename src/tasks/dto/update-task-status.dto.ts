import { TasksStatus } from '../task.enum';
import { IsEnum } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsEnum(TasksStatus)
  status: TasksStatus;
}
