import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCourseDto {
  @ApiPropertyOptional({
    description: 'The title of the course',
    example: 'Updated Course Title',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the course',
    example: 'Updated course description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Whether the course is published and available to students',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
