import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsUrl,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty({
    description: 'The title of the lesson',
    example: 'Introduction to Design thinking',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the lesson',
    example: 'Overview of design thinking principles',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'YouTube video URL for the lesson',
    example: 'https://youtube.com/watch?v=example',
  })
  @IsUrl()
  @IsNotEmpty()
  videoUrl: string;

  @ApiProperty({
    description: 'Duration of the video in seconds',
    example: 600,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  duration: number;

  @ApiProperty({
    description: 'Order of the lesson within the module',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  order: number;
}
