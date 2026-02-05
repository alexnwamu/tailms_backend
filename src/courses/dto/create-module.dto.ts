import { IsString, IsNotEmpty, IsInt, IsPositive, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateLessonDto } from './create-lesson.dto';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsPositive()
  order: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLessonDto)
  @IsOptional()
  lessons?: CreateLessonDto[];
}
