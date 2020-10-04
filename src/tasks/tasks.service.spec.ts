import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';



const mockUser = { username: 'Test User', id: 12 };
const mockCreateTaskDto = {title: 'Test Task Title', description: 'Test Task Description'};

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne : jest.fn(),
  createTask: jest.fn(),
  deleteTaskById: jest.fn(),
  delete: jest.fn(),
});

describe('TasksService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository},
      ]
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('should get all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');

      await expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'Some search query'};
      const result = await tasksService.getTasks(filters, mockUser);
      await expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('should calls taskRepository.findOne() and successfully retrieve and return the task', async () => {
      const mockTask = { title: 'Test Task', description: 'Test desc' };
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({where: { id: 1, userId: mockUser.id }})

    });

    it('should throws an error as task is not found', async () => {
      taskRepository.findOne.mockResolvedValue(null);
      await expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });
  
  describe('createTask', () => {
    it('should calls taskRepository.createTask() and return a new task', async () => {
      taskRepository.createTask.mockResolvedValue('dummy');

      await expect(taskRepository.createTask).not.toHaveBeenCalled();
      const result = await tasksService.createTask(mockCreateTaskDto, mockUser);
      await expect(taskRepository.createTask).toHaveBeenCalledWith(mockCreateTaskDto, mockUser);
      await expect(result).toEqual('dummy');

    });
  });

  describe('deleteTaskById', () => {
    it('should calls taskRepository.deleteTaskById to delete a task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      await expect(taskRepository.deleteTaskById).not.toHaveBeenCalled();

      const result = await tasksService.deleteTaskById(1, mockUser);
      await expect(taskRepository.delete).toHaveBeenCalledWith({id: 1, userId: mockUser.id });

    });

    it('should throws an error as task not found', async () => {
      taskRepository.delete.mockResolvedValue({affected: 0});
      await expect(tasksService.deleteTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });




});