import { IsEnum, IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { toArray } from 'rxjs/operators';
import { TaskStatus } from '../task-status.enum';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}