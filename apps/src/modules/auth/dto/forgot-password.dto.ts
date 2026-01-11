import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ description: 'email or phone number to look up user', example: 'user@example.com' })
  @IsString()
  identifier: string;
}
