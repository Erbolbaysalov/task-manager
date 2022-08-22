import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TasksStatus } from './task.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { DataSource, Repository } from 'typeorm';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { query } from 'express';
import { timeoutWith } from 'rxjs';
import loader from 'ts-loader';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksServices');
  private readonly tasksRepository: Repository<Task>;

  constructor(dataSource: DataSource) {
    this.tasksRepository = dataSource.getRepository(Task);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID not "${id}" found`);
    }
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id, user });

    if (!found) {
      throw new NotFoundException(`Task with Id "${id}" not found`);
    }
    return found;
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const query = this.tasksRepository.createQueryBuilder('task');
    query.where({ user });
    const { status, search } = filterDto;
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(lower(task.title) like lower(:search) or lower(task.description) like lower(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(`Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`);
      throw new InternalServerErrorException();
    }
  }
  async createTasks(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.tasksRepository.create({
      title,
      description,
      status: TasksStatus.OPEN,
      user,
    });
    await this.tasksRepository.save(task);
    return task;
  }

  // createTasks(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TasksStatus.OPEN,
  //   };
  //
  //   this.tasks.push(task);
  //
  //   return task;
  // }

  async updateTaskStatus(
    id: string,
    status: TasksStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}
