import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
   @ApiProperty({
      description: 'Post ID that this comment belongs to',
      example: 'uuid-here',
   })
   postId: string;

   @ApiProperty({
      description: 'Content of the comment',
      example: 'Great post!',
   })
   content: string;
}

export class UpdateCommentDto {
   @ApiPropertyOptional({
      description: 'Content of the comment',
      example: 'Updated comment',
   })
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
