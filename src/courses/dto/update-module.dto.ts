import { IsString, IsInt, IsPositive, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateModuleDto {
  @ApiPropertyOptional({
    description: 'The title of the module',
    example: 'Updated Module Title',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the module',
    example: 'Updated module description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Order of the module within the course',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  order?: number;
}
