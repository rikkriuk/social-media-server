import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class SignupDto {
  @ApiProperty({ required: false, example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, example: '+628123456789' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, { message: 'phoneNumber must be a valid phone number' })
  phoneNumber?: string;

  @ApiProperty({ required: false, example: 'alice' })
    @IsOptional()
    @IsString()
    @Matches(/^[a-zA-Z0-9_]{3,30}$/, { message: 'username must be 3-30 chars alphanumeric or underscore' })
  username?: string;

  @ApiProperty({ required: true, example: 'P@ssw0rd!' })
  @IsString()
  @MinLength(6)
  password: string;
}
