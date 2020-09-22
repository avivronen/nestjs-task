import { TaskStatus } from '../task.model';
import { IsEnum, IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { toArray } from 'rxjs/operators';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}