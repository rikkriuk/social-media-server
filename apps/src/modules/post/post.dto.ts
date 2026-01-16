import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreatePostDto {
   @IsString()
   @ApiProperty({
      description: 'Content of the post',
      example: 'This is my first post!',
   })
   content: string;

   @IsOptional()
   @IsArray()
   @Transform(({ value }) => value || [])
   @ApiPropertyOptional({
      description: 'Array of media IDs',
      example: ['media-id-1', 'media-id-2'],
   })
   mediaIds?: string[];
}

export class UpdatePostDto {
   @IsOptional()
   @IsString()
   @ApiPropertyOptional({
      description: 'Content of the post',
      example: 'Updated post content',
   })
   content?: string;

   @IsOptional()
   @IsArray()
   @Transform(({ value }) => value || [])
   @ApiPropertyOptional({
      description: 'Array of media IDs',
      example: ['media-id-1'],
   })
   mediaIds?: string[];
}

export class PostResponseDto {
   @ApiProperty()
   id: string;

   @ApiProperty()
   profileId: string;

   @ApiPropertyOptional()
   profile?: any;

   @ApiProperty()
   content: string;

   @ApiPropertyOptional()
   mediaIds?: string[];

   @ApiProperty()
   likesCount: number;

   @ApiProperty()
   commentsCount: number;

   @ApiProperty()
   createdAt: Date;

   @ApiProperty()
   updatedAt: Date;
}

export class PaginationQueryDto {
   @IsOptional()
   @Type(() => Number)
   @IsNumber()
   @ApiPropertyOptional({
      description: 'Number of items per page',
      example: 10,
      default: 10,
   })
   limit?: number = 10;

   @IsOptional()
   @Type(() => Number)
   @IsNumber()
   @ApiPropertyOptional({
      description: 'Number of items to skip',
      example: 0,
      default: 0,
   })
   offset?: number = 0;
}