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
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateModuleDto)
  @IsOptional()
  modules?: CreateModuleDto[];
}
