import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateLessonDto } from './create-lesson.dto';

export class CreateModuleDto {
  @ApiProperty({
    description: 'The title of the module',
    example: 'Module 1 - Introduction',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the module',
    example: 'Getting started with design thinking',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Order of the module within the course',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  order: number;

  @ApiPropertyOptional({
    description: 'Array of lessons in the module',
    type: [CreateLessonDto],
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLessonDto)
  @IsOptional()
  lessons?: CreateLessonDto[];
}
