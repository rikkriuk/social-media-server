import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export enum IdentifierType {
  EMAIL = 'Email',
  PHONE = 'PhoneNumber',
  USERNAME = 'Username',
}

export class LoginDto {
  @ApiProperty({ example: 'Email', enum: IdentifierType })
  @IsString()
  identifierType: IdentifierType;

  @ApiProperty({ example: 'user@example.com' })
  @IsString()
  identifier: string;

  @ApiProperty({ example: 'P@ssw0rd!' })
  @IsString()
  password: string;
}