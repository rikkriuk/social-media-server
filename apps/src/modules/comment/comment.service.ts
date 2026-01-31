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
         if (dto.parentId) {
            const parent = await this.commentModel.findByPk(dto.parentId);
            if (!parent) {
               throw new Error('Parent comment not found');
            }
            if (parent.parentId !== null) {
               throw new Error('Cannot reply to a reply');
            }
         }

         const comment = await this.commentModel.create(dto as any);

         await this.postModel.increment('commentsCount', {
            by: 1,
            where: { id: dto.postId },
         });

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
            where: { postId, parentId: null },
            include: [
               {
                  model: Profile,
                  attributes: ['id', 'name', 'profileImage'],
               },
               {
                  model: Comment,
                  as: 'replies',
                  include: [
                     {
                        model: Profile,
                        attributes: ['id', 'name', 'profileImage'],
                     },
                  ],
                  order: [['createdAt', 'ASC']],
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

         let decrementBy = 1;
         if (comment.parentId === null) {
            const replyCount = await this.commentModel.count({
               where: { parentId: commentId },
            });
            decrementBy += replyCount;
         }

         await this.commentModel.destroy({
            where: { id: commentId },
         });

         await this.postModel.decrement('commentsCount', {
            by: decrementBy,
            where: { id: comment.postId },
         });
      } catch (error) {
         throw error;
      }
   }
}
