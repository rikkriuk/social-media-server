import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyDto {
  @ApiProperty({ example: 'b3e9a1f2-...' })
  @IsString()
  userId: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  code: string;
}
