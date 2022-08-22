import { TasksStatus } from '../task.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TasksStatus)
  status?: TasksStatus;
  @IsOptional()
  @IsString()
  search?: string;
}
