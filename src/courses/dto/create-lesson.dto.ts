import { IsString, IsNotEmpty, IsInt, IsPositive, IsUrl, IsOptional } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsNotEmpty()
  videoUrl: string;

  @IsInt()
  @IsPositive()
  duration: number;

  @IsInt()
  @IsPositive()
  order: number;
}
