import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { 
   CreateNotificationDto, 
   NotificationResponseDto, 
   GetNotificationsDto,
   GetUnreadNotificationsDto,
   GetReadNotificationsDto,
   MarkAllAsReadDto,
   GetUnreadCountDto,
} from './notification.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
   constructor(private service: NotificationService) {}

   @Post('create')
   @ApiOperation({ summary: 'Create a new notification' })
   async createNotification(@Body() dto: CreateNotificationDto): Promise<NotificationResponseDto> {
      return this.service.create(dto);
   }

   @Get()
   @ApiOperation({ summary: 'Get all notifications for user' })
   async getNotifications(@Query() query: GetNotificationsDto) {
      return this.service.getNotifications(query);
   }

   @Get('unread')
   @ApiOperation({ summary: 'Get unread notifications' })
   async getUnreadNotifications(@Query() query: GetUnreadNotificationsDto): Promise<NotificationResponseDto[]> {
      return this.service.getUnreadNotifications(query.recipientProfileId);
   }

   @Get('read')
   @ApiOperation({ summary: 'Get read notifications' })
   async getReadNotifications(@Query() query: GetReadNotificationsDto) {
      return this.service.getReadNotifications(query);
   }

   @Post(':id/mark-as-read')
   @ApiOperation({ summary: 'Mark a notification as read' })
   async markAsRead(@Param('id') notificationId: string): Promise<NotificationResponseDto> {
      return this.service.markAsRead(notificationId);
   }

   @Post('mark-all-as-read')
   @ApiOperation({ summary: 'Mark all notifications as read' })
   async markAllAsRead(@Body() dto: MarkAllAsReadDto): Promise<{ message: string }> {
      await this.service.markAllAsRead(dto.recipientProfileId);
      return { message: 'All notifications marked as read' };
   }

   @Get('unread-count')
   @ApiOperation({ summary: 'Get unread notification count' })
   async getUnreadCount(@Query() query: GetUnreadCountDto): Promise<{ count: number }> {
      const count = await this.service.getUnreadCount(query.recipientProfileId);
      return { count };
   }
}
