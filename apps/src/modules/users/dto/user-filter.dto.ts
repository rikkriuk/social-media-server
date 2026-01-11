import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt } from 'class-validator';

export class UserFilterDto {
  @ApiPropertyOptional({ description: "Filter by user's username (partial)" })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ description: "Filter by user's email (partial)" })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: "Filter by user's phone (partial)" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'limit' })
  @IsOptional()
  @IsInt()
  limit?: number;

  @ApiPropertyOptional({ description: 'offset' })
  @IsOptional()
  @IsInt()
  offset?: number;
}
