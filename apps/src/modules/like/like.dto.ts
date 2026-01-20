import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLikeDto {
   @ApiProperty({
      description: 'Post ID to like',
      example: 'uuid-here',
   })
   @IsNotEmpty()
   @IsUUID()
   postId: string;

   @ApiProperty({
      description: 'Profile ID of the user liking the post',
      example: 'uuid-here',
   })
   @IsNotEmpty()
   @IsUUID()
   profileId: string;
}

export class UnlikeDto {
   @ApiProperty({
      description: 'Post ID to unlike',
      example: 'uuid-here',
   })
   @IsNotEmpty()
   @IsUUID()
   postId: string;

   @ApiProperty({
      description: 'Profile ID of the user unliking the post',
      example: 'uuid-here',
   })
   @IsNotEmpty()
   @IsUUID()
   profileId: string;
}

export class GetLikesDto {
   @ApiProperty({
      description: 'Post ID to get likes for',
      example: 'uuid-here',
   })
   @IsNotEmpty()
   @IsUUID()
   postId: string;

   @ApiPropertyOptional({ default: 10 })
   @IsOptional()
   @Type(() => Number)
   limit?: number;

   @ApiPropertyOptional({ default: 0 })
   @IsOptional()
   @Type(() => Number)
   offset?: number;
}

export class CheckLikeDto {
   @ApiProperty({
      description: 'Post ID to check',
      example: 'uuid-here',
   })
   @IsNotEmpty()
   @IsUUID()
   postId: string;

   @ApiProperty({
      description: 'Profile ID to check',
      example: 'uuid-here',
   })
   @IsNotEmpty()
   @IsUUID()
   profileId: string;
}

export class LikeResponseDto {
   @ApiProperty()
   id: string;

   @ApiProperty()
   postId: string;

   @ApiProperty()
   profileId: string;

   @ApiPropertyOptional()
   profile?: any;

   @ApiProperty()
   createdAt: Date;

   @ApiProperty()
   updatedAt: Date;
}
