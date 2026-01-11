import { ApiPropertyOptional, ApiQuery } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { applyDecorators } from '@nestjs/common';

export class ProfileFilterDto {
  @ApiPropertyOptional({ description: 'Filter by user id (UUID)' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ description: 'Filter by profile name (partial, case-insensitive)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: "Filter by user's username (partial, case-insensitive)" })
  @IsOptional()
  @IsString()
  username?: string;
}

export function ApiProfileQuery() {
  return applyDecorators(
    ApiQuery({ name: 'userId', required: false, description: 'Filter by user id (UUID)' }),
    ApiQuery({ name: 'name', required: false, description: 'Filter by profile name (partial, case-insensitive)' }),
    ApiQuery({ name: 'username', required: false, description: "Filter by user's username (partial, case-insensitive)" }),
  );
}
