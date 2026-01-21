import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './notification.entity';
import { CreateNotificationDto, NotificationResponseDto, GetNotificationsDto, GetReadNotificationsDto } from './notification.dto';
import { paginatedResult } from '../../common/response.helper';

@Injectable()
export class NotificationService {
   constructor(
      @InjectModel(Notification)
      private notificationModel: typeof Notification,
   ) {}

   async create(dto: CreateNotificationDto): Promise<NotificationResponseDto> {
      try {
         const existingNotif = await this.notificationModel.findOne({
            where: {
               recipientProfileId: dto.recipientProfileId,
               actorProfileId: dto.actorProfileId,
               type: dto.type,
               postId: dto.postId || null,
               commentId: dto.commentId || null,
            },
         });

         if (existingNotif) {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            if (existingNotif.createdAt > oneHourAgo) {
               return this.toResponseDto(existingNotif);
            }
         }

         const notification = await this.notificationModel.create(dto);
         return this.toResponseDto(await notification.reload({
            include: ['actor', 'post', 'comment'],
         }));
      } catch (error) {
         throw error;
      }
   }

   async getNotifications(dto: GetNotificationsDto) {
      try {
         const { recipientProfileId, limit = 20, offset = 0 } = dto;

         const { rows, count } = await this.notificationModel.findAndCountAll({
            where: { recipientProfileId },
            include: ['actor', 'post', 'comment'],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
         });

         return paginatedResult(
            { rows: rows.map(n => this.toResponseDto(n)), count },
            limit,
            offset,
         );
      } catch (error) {
         throw error;
      }
   }

   async getUnreadNotifications(recipientProfileId: string): Promise<NotificationResponseDto[]> {
      try {
         const notifications = await this.notificationModel.findAll({
            where: {
               recipientProfileId,
               isRead: false,
            },
            include: ['actor', 'post', 'comment'],
            order: [['createdAt', 'DESC']],
         });

         return notifications.map(n => this.toResponseDto(n));
      } catch (error) {
         throw error;
      }
   }

   async getReadNotifications(dto: GetReadNotificationsDto) {
      try {
         const { recipientProfileId, limit = 20, offset = 0 } = dto;

         const { rows, count } = await this.notificationModel.findAndCountAll({
            where: {
               recipientProfileId,
               isRead: true,
            },
            include: ['actor', 'post', 'comment'],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
         });

         return paginatedResult(
            { rows: rows.map(n => this.toResponseDto(n)), count },
            limit,
            offset,
         );
      } catch (error) {
         throw error;
      }
   }

   async markAsRead(notificationId: string): Promise<NotificationResponseDto> {
      try {
         const notification = await this.notificationModel.findByPk(notificationId);
         if (!notification) {
            throw new Error('Notification not found');
         }

         notification.isRead = true;
         await notification.save();
         await notification.reload({
            include: ['actor', 'post', 'comment'],
         });

         return this.toResponseDto(notification);
      } catch (error) {
         throw error;
      }
   }

   async markAllAsRead(recipientProfileId: string): Promise<void> {
      try {
         await this.notificationModel.update(
            { isRead: true },
            {
               where: {
                  recipientProfileId,
                  isRead: false,
               },
            },
         );
      } catch (error) {
         throw error;
      }
   }

   async deleteNotification(notificationId: string): Promise<void> {
      try {
         await this.notificationModel.destroy({
            where: { id: notificationId },
         });
      } catch (error) {
         throw error;
      }
   }

   async getUnreadCount(recipientProfileId: string): Promise<number> {
      try {
         const count = await this.notificationModel.count({
            where: {
               recipientProfileId,
               isRead: false,
            },
         });

         return count;
      } catch (error) {
         throw error;
      }
   }

   private toResponseDto(notification: Notification): NotificationResponseDto {
      return {
         id: notification.id,
         recipientProfileId: notification.recipientProfileId,
         actorProfileId: notification.actorProfileId,
         actor: notification.actor,
         type: notification.type,
         postId: notification.postId,
         post: notification.post,
         commentId: notification.commentId,
         comment: notification.comment,
         isRead: notification.isRead,
         createdAt: notification.createdAt,
         updatedAt: notification.updatedAt,
      };
   }
}
