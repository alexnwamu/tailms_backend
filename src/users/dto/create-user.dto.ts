import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';
import { UserStatus } from '../../common/enums/user-status.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the user account',
    example: 'SecureP@ssw0rd!',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: Role,
    example: Role.STUDENT,
  })
  @IsEnum(Role)
  role: Role;

  @ApiPropertyOptional({
    description: 'The status of the user account',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    default: UserStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
