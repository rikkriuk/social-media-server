import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ example: 'Alice' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'I like camping' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: 'Jakarta' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 'https://example.com' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ example: 'female' })
  @IsOptional()
  @IsString()
  gender?: string;
}
