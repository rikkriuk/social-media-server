import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateCommentDto {
   @ApiProperty({
      description: 'Post ID that this comment belongs to',
      example: 'uuid-here',
   })
   @IsUUID()
   postId: string;

   @ApiProperty({
      description: 'Content of the comment',
      example: 'Great post!',
   })
   @IsString()
   content: string;

   @IsOptional()
   profileId?: string;

   @ApiPropertyOptional({
      description: 'Parent comment ID for replies (1 level only)',
      example: 'uuid-here',
   })
   @IsOptional()
   @IsUUID()
   parentId?: string | null;
}

export class UpdateCommentDto {
   @ApiPropertyOptional({
      description: 'Content of the comment',
      example: 'Updated comment',
   })
   @IsOptional()
   @IsString()
   content?: string;
}

export class CommentResponseDto {
   @ApiProperty()
   id: string;

   @ApiProperty()
   postId: string;

   @ApiProperty()
   profileId: string;

   @ApiPropertyOptional()
   profile?: any;

   @ApiProperty()
   content: string;

   @ApiProperty()
   likesCount: number;

   @ApiProperty()
   createdAt: Date;

   @ApiProperty()
   updatedAt: Date;
}
