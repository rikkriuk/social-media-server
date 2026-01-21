import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/pagination.dto';

export class CreateNotificationDto {
   @ApiProperty({
      description: 'Recipient profile ID',
      example: 'uuid-here',
   })
   @IsUUID()
   recipientProfileId: string;

   @ApiProperty({
      description: 'Actor profile ID (who triggered the notification)',
      example: 'uuid-here',
   })
   @IsUUID()
   actorProfileId: string;

   @ApiProperty({
      description: 'Type of notification',
      enum: ['like', 'comment', 'follow'],
      example: 'like',
   })
   @IsEnum(['like', 'comment', 'follow'])
   type: 'like' | 'comment' | 'follow';

   @ApiPropertyOptional({
      description: 'Post ID (required for like/comment notifications)',
      example: 'uuid-here',
   })
   @IsOptional()
   @IsUUID()
   postId?: string;

   @ApiPropertyOptional({
      description: 'Comment ID (for like on comment)',
      example: 'uuid-here',
   })
   @IsOptional()
   @IsUUID()
   commentId?: string;
}

export class GetNotificationsDto extends PaginationDto {
   @ApiProperty({
      description: 'Recipient profile ID',
      example: 'uuid-here',
   })
   @IsUUID()
   recipientProfileId: string;
}

export class GetUnreadNotificationsDto {
   @ApiProperty({
      description: 'Recipient profile ID',
      example: 'uuid-here',
   })
   @IsUUID()
   recipientProfileId: string;
}

export class GetReadNotificationsDto extends PaginationDto {
   @ApiProperty({
      description: 'Recipient profile ID',
      example: 'uuid-here',
   })
   @IsUUID()
   recipientProfileId: string;
}

export class MarkAllAsReadDto {
   @ApiProperty({
      description: 'Recipient profile ID',
      example: 'uuid-here',
   })
   @IsUUID()
   recipientProfileId: string;
}

export class GetUnreadCountDto {
   @ApiProperty({
      description: 'Recipient profile ID',
      example: 'uuid-here',
   })
   @IsUUID()
   recipientProfileId: string;
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
