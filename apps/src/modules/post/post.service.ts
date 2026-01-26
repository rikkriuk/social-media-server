import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './post.entity';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { paginateResponse } from 'apps/src/common/response.helper';

@Injectable()
export class PostService {
   constructor(
      @InjectModel(Post)
      private postModel: typeof Post,
   ) {}

   async createPost(profileId: string, createPostDto: CreatePostDto) {
      try {
         console.log('Creating post for profileId:', profileId, 'with data:', createPostDto);
         const post = await this.postModel.create({
            profileId,
            content: createPostDto.content,
            mediaIds: createPostDto.mediaIds || [],
            likesCount: 0,
            commentsCount: 0,
         });

         return post;
      } catch (error) {
         throw new BadRequestException('Failed to create post');
      }
   }

   async getPosts(limit: number = 10, offset: number = 0) {
      try {
         const { count, rows } = await this.postModel.findAndCountAll({
            order: [['created_at', 'DESC']],
            limit,
            offset,
            include: [
               {
                  association: 'profile',
                  attributes: ['id', 'name'],
               },
            ],
         });

         return paginateResponse(rows, count, limit, offset);
      } catch (error) {
         throw new BadRequestException('Failed to fetch posts');
      }
   }

   async getPostById(postId: string) {
      try {
         const post = await this.postModel.findByPk(postId, {
            include: [
               {
                  association: 'profile',
                  attributes: ['id', 'name'],
               },
               {
                  association: 'likes',
                  attributes: ['id', 'profile_id'],
               },
               {
                  association: 'comments',
                  attributes: ['id', 'content', 'profile_id'],
               },
            ],
         });

         if (!post) {
            throw new NotFoundException('Post not found');
         }

         return post;
      } catch (error) {
         if (error instanceof NotFoundException) throw error;
         throw new BadRequestException('Failed to fetch post');
      }
   }

   async getUserPosts(profileId: string, limit: number = 10, offset: number = 0) {
      try {
         const { count, rows } = await this.postModel.findAndCountAll({
            where: { profileId },
            order: [['created_at', 'DESC']],
            limit,
            offset,
            include: [
               {
                  association: 'profile',
                  attributes: ['id', 'name'],
               },
            ],
         });

         return paginateResponse(rows, count, limit, offset);
      } catch (error) {
         throw new BadRequestException('Failed to fetch user posts');
      }
   }

   async updatePost(postId: string, profileId: string, updatePostDto: UpdatePostDto) {
      try {
         const post = await this.postModel.findByPk(postId);

         if (!post) {
            throw new NotFoundException('Post not found');
         }

         if (post.profileId !== profileId) {
            throw new BadRequestException('You can only update your own posts');
         }

         await post.update({
            content: updatePostDto.content || post.content,
            media_ids: updatePostDto.mediaIds || post.mediaIds,
         });

         return post;
      } catch (error) {
         if (error instanceof NotFoundException || error instanceof BadRequestException) {
            throw error;
         }
         throw new BadRequestException('Failed to update post');
      }
   }

   async deletePost(postId: string, profileId: string) {
      try {
         const post = await this.postModel.findByPk(postId);

         if (!post) {
            throw new NotFoundException('Post not found');
         }

         if (post.profileId !== profileId) {
            throw new BadRequestException('You can only delete your own posts');
         }

         await post.destroy();
         return { message: 'Post deleted successfully' };
      } catch (error) {
         if (error instanceof NotFoundException || error instanceof BadRequestException) {
            throw error;
         }
         throw new BadRequestException('Failed to delete post');
      }
   }

   async incrementLikesCount(postId: string) {
      try {
         const post = await this.postModel.findByPk(postId);
         if (post) {
            await post.increment('likes_count');
         }
      } catch (error) {
         console.error('Error incrementing likes count:', error);
      }
   }

   async decrementLikesCount(postId: string) {
      try {
         const post = await this.postModel.findByPk(postId);
         if (post) {
            await post.decrement('likes_count');
         }
      } catch (error) {
         console.error('Error decrementing likes count:', error);
      }
   }

   async incrementCommentsCount(postId: string) {
      try {
         const post = await this.postModel.findByPk(postId);
         if (post) {
            await post.increment('comments_count');
         }
      } catch (error) {
         console.error('Error incrementing comments count:', error);
      }
   }

   async decrementCommentsCount(postId: string) {
      try {
         const post = await this.postModel.findByPk(postId);
         if (post) {
            await post.decrement('comments_count');
         }
      } catch (error) {
         console.error('Error decrementing comments count:', error);
      }
   }
}
