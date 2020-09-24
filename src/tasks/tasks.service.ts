import { Injectable, NotFoundException } from '@nestjs/common';
//import { Task, TaskStatus } from './task.model';
import { Task } from './task.entity';
//import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task-status.enum';
import { DeleteResult } from 'typeorm';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) {}

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({where: { id, userId: user.id }});
    if(!found) {
      throw new NotFoundException(`Task with "${id}" not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTaskById(id: number, user: User): Promise<DeleteResult> {
    //const task = await this.getTaskById(id);
    const result = await this.taskRepository.delete({id: id, userId: user.id});
    if(result.affected === 0) {
      throw new NotFoundException(`Task with "${id}" not found`);
    }
    return result;
  }

  async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    return await task.save();
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return await this.taskRepository.getTasks(filterDto, user);
  }

  /*private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return [...this.tasks];
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const {status, search } = filterDto;

    let tasks = this.getAllTasks();
    if(status) {
      tasks = tasks.filter(task => task.status === status);
    }
    if(search) {
      tasks = tasks.filter(task =>
      task.title.includes(search) ||
      task.description.includes(search));
    }
    return tasks;
  }


  getTaskById(id: string): Task {
    const found =  this.tasks.find(task => task.id === id );
    if(!found) {
      throw new NotFoundException(`Task with "${id}" not found`);
    }
    return found;
  }

  deleteTaskById(id: string): void {
    const found = this.getTaskById(id);
      this.tasks.filter((task) => {
        return task.id === found.id;
      })
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description} = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN
    };

    this.tasks.push(task);
    return task;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }*/
}
