import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Like } from './like.entity';
import { Post } from '../post/post.entity';
import { Profile } from '../profile/profile.model';
import { CreateLikeDto, UnlikeDto, GetLikesDto, CheckLikeDto } from './like.dto';
import { paginatedResult } from '../../common/response.helper';

@Injectable()
export class LikeService {
   constructor(
      @InjectModel(Like) private likeModel: typeof Like,
      @InjectModel(Post) private postModel: typeof Post,
   ) {}

   async likePost(data: CreateLikeDto): Promise<{ data: Like; likesCount: number }> {
      const { postId, profileId } = data;

      const existingLike = await this.likeModel.findOne({
         where: { postId, profileId },
      });

      if (existingLike) {
         throw new ConflictException('You have already liked this post');
      }

      const like = await this.likeModel.create({ postId, profileId });

      await this.postModel.increment('likesCount', {
         by: 1,
         where: { id: postId },
      });

      const post = await this.postModel.findByPk(postId);

      return {
         data: like,
         likesCount: post?.likesCount || 0,
      };
   }

   async unlikePost(data: UnlikeDto): Promise<{ message: string; likesCount: number }> {
      const { postId, profileId } = data;

      const deleted = await this.likeModel.destroy({
         where: { postId, profileId },
      });

      if (deleted > 0) {
         await this.postModel.decrement('likesCount', {
            by: 1,
            where: { id: postId },
         });
      }

      const post = await this.postModel.findByPk(postId);

      return {
         message: 'Successfully unliked the post',
         likesCount: post?.likesCount || 0,
      };
   }

   async getLikes(data: GetLikesDto) {
      const { postId, limit = 10, offset = 0 } = data;

      const result = await this.likeModel.findAndCountAll({
         where: { postId },
         include: [{
            model: Profile,
            as: 'profile',
            attributes: ['id', 'name', 'bio'],
         }],
         limit,
         offset,
         order: [['createdAt', 'DESC']],
      });

      return paginatedResult(result, limit, offset);
   }

   async checkLike(data: CheckLikeDto): Promise<{ isLiked: boolean }> {
      const { postId, profileId } = data;

      const like = await this.likeModel.findOne({
         where: { postId, profileId },
      });

      return { isLiked: !!like };
   }

   async getLikeCount(postId: string): Promise<{ count: number }> {
      const count = await this.likeModel.count({
         where: { postId },
      });

      return { count };
   }
}
