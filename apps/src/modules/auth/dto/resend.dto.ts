import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResendDto {
  @ApiProperty({ example: 'b3e9a1f2-...' })
  @IsString()
  userId: string;
}
