import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../../common/enums/user-status.enum';

export class UpdateUserStatusDto {
  @ApiProperty({
    description: 'The new status of the user',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  @IsEnum(UserStatus)
  @IsNotEmpty()
  status: UserStatus;
}
