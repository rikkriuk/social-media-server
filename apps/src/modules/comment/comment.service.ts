import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './comment.dto';
import { Post } from '../post/post.entity';
import { Profile } from '../profile/profile.model';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CommentService {
   constructor(
      @InjectModel(Comment)
      private commentModel: typeof Comment,
      @InjectModel(Post)
      private postModel: typeof Post,
      @InjectModel(Profile)
      private profileModel: typeof Profile,
      private notificationService: NotificationService,
   ) {}

   async createComment(dto: CreateCommentDto): Promise<Comment> {
      try {
         const comment = await this.commentModel.create(dto as any);

         // Increment comment count on post
         await this.postModel.increment('commentsCount', {
            by: 1,
            where: { id: dto.postId },
         });

         // Get post and create notification
         const post = await this.postModel.findByPk(dto.postId);
         if (post && post.profileId !== dto.profileId) {
            try {
               await this.notificationService.create({
                  recipientProfileId: post.profileId,
                  actorProfileId: dto.profileId,
                  type: 'comment',
                  postId: dto.postId,
                  commentId: comment.id,
               });
            } catch (error) {
               console.error('Failed to create comment notification:', error);
            }
         }

         return comment;
      } catch (error) {
         throw error;
      }
   }

   async getCommentsByPost(postId: string, limit: number = 10, offset: number = 0) {
      try {
         const { rows, count } = await this.commentModel.findAndCountAll({
            where: { postId },
            include: [
               {
                  model: Profile,
                  attributes: ['id', 'name', 'profileImage'],
               },
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
         });

         return {
            data: rows,
            total: count,
            limit,
            offset,
         };
      } catch (error) {
         throw error;
      }
   }

   async deleteComment(commentId: string, profileId: string): Promise<void> {
      try {
         const comment = await this.commentModel.findByPk(commentId);
         if (!comment || comment.profileId !== profileId) {
            throw new Error('Unauthorized or comment not found');
         }

         await this.commentModel.destroy({
            where: { id: commentId },
         });

         // Decrement comment count
         await this.postModel.decrement('commentsCount', {
            by: 1,
            where: { id: comment.postId },
         });
      } catch (error) {
         throw error;
      }
   }
}
