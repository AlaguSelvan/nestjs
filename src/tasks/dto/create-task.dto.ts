import { IsNotEmpty } from 'class-validator'

export class CreateTaskDto {
  title: string;

  @IsNotEmpty()
  description: string;
}
