import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
   @ApiProperty({
      description: 'Recipient profile ID',
      example: 'uuid-here',
   })
   recipientProfileId: string;

   @ApiProperty({
      description: 'Actor profile ID (who triggered the notification)',
      example: 'uuid-here',
   })
   actorProfileId: string;

   @ApiProperty({
      description: 'Type of notification',
      enum: ['like', 'comment', 'follow'],
      example: 'like',
   })
   type: 'like' | 'comment' | 'follow';

   @ApiPropertyOptional({
      description: 'Post ID (required for like/comment notifications)',
      example: 'uuid-here',
   })
   postId?: string;

   @ApiPropertyOptional({
      description: 'Comment ID (for like on comment)',
      example: 'uuid-here',
   })
   commentId?: string;
}

export class NotificationResponseDto {
   @ApiProperty()
   id: string;

   @ApiProperty()
   recipientProfileId: string;

   @ApiProperty()
   actorProfileId: string;

   @ApiPropertyOptional()
   actor?: any;

   @ApiProperty({
      enum: ['like', 'comment', 'follow'],
   })
   type: 'like' | 'comment' | 'follow';

   @ApiPropertyOptional()
   postId?: string;

   @ApiPropertyOptional()
   post?: any;

   @ApiPropertyOptional()
   commentId?: string;

   @ApiPropertyOptional()
   comment?: any;

   @ApiProperty()
   isRead: boolean;

   @ApiProperty()
   createdAt: Date;

   @ApiProperty()
   updatedAt: Date;
}
