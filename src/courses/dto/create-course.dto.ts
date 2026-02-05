import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateModuleDto } from './create-module.dto';

export class CreateCourseDto {
  @ApiProperty({
    description: 'The title of the course',
    example: 'Introduction to Design Thinking',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the course',
    example:
      'An introductory course in design covering design thinking, laws and principles',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'Whether the course is published and available to students',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiPropertyOptional({
    description: 'Array of modules in the course',
    type: [CreateModuleDto],
    isArray: true,
    example: [
      {
        title: 'Module 1 - Introduction to Design Thinking',
        description: 'Getting started with design thinking fundamentals',
        order: 1,
        lessons: [
          {
            title: 'Introduction to Design thinking',
            description: 'Overview of design thinking principles',
            videoUrl: 'https://youtube.com/watch?v=example1',
            duration: 600,
            order: 1,
          },
          {
            title: 'Design Thinking Process',
            description: 'Understanding the 5 stages of design thinking',
            videoUrl: 'https://youtube.com/watch?v=example2',
            duration: 900,
            order: 2,
          },
        ],
      },
      {
        title: 'Module 2 - Practical Applications',
        description: 'Applying design thinking in real-world scenarios',
        order: 2,
        lessons: [
          {
            title: 'Case Study Analysis',
            description: 'Analyzing successful design thinking implementations',
            videoUrl: 'https://youtube.com/watch?v=example3',
            duration: 1200,
            order: 1,
          },
        ],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateModuleDto)
  @IsOptional()
  modules?: CreateModuleDto[];
}
