import { Injectable } from '@nestjs/common';
import { UserFollow } from './userFollow.entity';
import { InjectModel } from '@nestjs/sequelize';
import { CreateFollowDto, FollowType, GetFollowersDto, GetFollowingDto, GetSuggestionsDto, SearchUsersDto } from './userFollow.dto';
import { User } from '../users/user.model';
import { Profile } from '../profile/profile.model';
import { Op, WhereOptions } from 'sequelize';
import { paginatedResult } from '../../common/response.helper';

@Injectable()
export class UserFollowService {
   constructor(
      @InjectModel(UserFollow) private userFollowModel: typeof UserFollow,
      @InjectModel(User) private userModel: typeof User,
   ) {}

   async count(userId: string): Promise<{ data: { followers: number; following: number } }> {
      const [followers, following] = await Promise.all([
         this.userFollowModel.count({ where: { followingId: userId } }),
         this.userFollowModel.count({ where: { followerId: userId } }),
      ]);

      return { 
         data: { followers, following }
      };
   }

   private async getFollowList(data: GetFollowersDto, type: FollowType) {
      const { userId, search, limit = 10, offset = 0 } = data;

      const isFollowers = type === FollowType.FOLLOWERS;
      // Entity uses singular: 'follower' and 'following' as alias
      const alias = isFollowers ? 'follower' : 'following';
      const whereField = isFollowers ? 'followingId' : 'followerId';

      const includeUser: any = {
         model: User,
         as: alias,
         attributes: ['id', 'username', 'email'],
         include: [{ model: Profile, attributes: ['id', 'name', 'bio'] }],
      };

      if (search) {
         includeUser.where = {
            [Op.or]: [
               { username: { [Op.iLike]: `%${search}%` } },
            ],
         };
         includeUser.required = true;
      }

      const result = await this.userFollowModel.findAndCountAll({
         where: { [whereField]: userId } as WhereOptions,
         include: [includeUser],
         limit,
         offset,
      });

      return paginatedResult(result, limit, offset);
   }

   async getFollowers(data: GetFollowersDto) {
      return this.getFollowList(data, FollowType.FOLLOWERS);
   }

   async getFollowing(data: GetFollowingDto) {
      return this.getFollowList(data, FollowType.FOLLOWING);
   }

   async followUser(data: CreateFollowDto): Promise<{ data: UserFollow }> {
      const { followerId, followingId } = data;
      const result = await this.userFollowModel.create({
         followerId,
         followingId,
      })

      return { data: result };
   }

   async unfollowUser(data: CreateFollowDto): Promise<{ message: string }> {
      const { followerId, followingId } = data;
      await this.userFollowModel.destroy({
         where: {
            followerId,
            followingId,
         },
      });
      return { message: "Successfully unfollowed the user." };
   }

   async getSuggestions(data: GetSuggestionsDto) {
      const { userId, limit = 10, offset = 0 } = data;

      const followingIds = await this.userFollowModel.findAll({
         where: { followerId: userId },
         attributes: ['followingId'],
      });
      const excludeIds = [userId, ...followingIds.map(f => f.followingId)];

      const result = await this.userModel.findAndCountAll({
         where: {
            id: { [Op.notIn]: excludeIds },
         },
         attributes: ['id', 'username', 'email'],
         include: [{
            model: Profile,
            attributes: ['id', 'name', 'bio'],
         }],
         limit,
         offset,
         order: [['createdAt', 'DESC']],
      });

      return paginatedResult(result, limit, offset);
   }

   async searchUsers(data: SearchUsersDto) {
      const { search, currentUserId, limit = 10, offset = 0 } = data;

      if (!search || search.trim() === '') {
         return paginatedResult({ rows: [], count: 0 }, limit, offset);
      }

      const whereClause: any = {};

      if (currentUserId) {
         whereClause.id = { [Op.ne]: currentUserId };
      }

      whereClause[Op.or] = [
         { username: { [Op.iLike]: `%${search}%` } },
      ];

      const result = await this.userModel.findAndCountAll({
         where: whereClause,
         attributes: ['id', 'username', 'email'],
         include: [{
            model: Profile,
            attributes: ['id', 'name', 'bio'],
         }],
         limit,
         offset,
      });

      const profileMatches = await this.userModel.findAndCountAll({
         where: currentUserId ? { id: { [Op.ne]: currentUserId } } : {},
         attributes: ['id', 'username', 'email'],
         include: [{
            model: Profile,
            attributes: ['id', 'name', 'bio'],
            where: { name: { [Op.iLike]: `%${search}%` } },
            required: true,
         }],
         limit,
         offset,
      });

      const existingIds = new Set(result.rows.map(u => u.id));
      for (const user of profileMatches.rows) {
         if (!existingIds.has(user.id)) {
            result.rows.push(user);
         }
      }

      return paginatedResult({ rows: result.rows, count: result.rows.length }, limit, offset);
   }

   async checkIsFollowing(followerId: string, followingId: string): Promise<{ isFollowing: boolean }> {
      const follow = await this.userFollowModel.findOne({
         where: { followerId, followingId },
      });
      return { isFollowing: !!follow };
   }
}