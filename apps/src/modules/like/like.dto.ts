import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLikeDto {
   @ApiProperty({
      description: 'Post ID to like',
      example: 'uuid-here',
   })
   postId: string;
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
