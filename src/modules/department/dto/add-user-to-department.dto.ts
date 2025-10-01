import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class AddUserToDepartmentDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}
