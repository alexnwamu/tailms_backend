import { IsString, IsNotEmpty, IsBoolean, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateModuleDto } from './create-module.dto';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateModuleDto)
  @IsOptional()
  modules?: CreateModuleDto[];
}
