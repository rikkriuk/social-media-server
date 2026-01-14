import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { IdentifierType } from './login.dto';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'Email', enum: IdentifierType })
  @IsString()
  identifierType: IdentifierType;

  @ApiProperty({ description: 'email or phone number to look up user', example: 'user@example.com' })
  @IsString()
  identifier: string;
}
