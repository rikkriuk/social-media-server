import { Injectable } from '@nestjs/common';
import { UserFollow } from './userFollow.entity';
import { InjectModel } from '@nestjs/sequelize';
import { CreateFollowDto, FollowType, GetFollowersDto, GetFollowingDto } from './userFollow.dto';
import { User } from '../users/user.model';
import { Profile } from '../profile/profile.model';
import { Op, WhereOptions } from 'sequelize';
import { paginatedResult } from '../../common/response.helper';

@Injectable()
export class UserFollowService {
  constructor(
    @InjectModel(UserFollow) private userFollowModel: typeof UserFollow,
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
      const alias = isFollowers ? FollowType.FOLLOWERS : FollowType.FOLLOWING;
      const whereField = isFollowers ? 'followingId' : 'followerId';

      const includeUser: any = {
         model: User,
         as: alias,
         attributes: ['id', 'username', 'email'],
         include: [{ model: Profile, attributes: ['id', 'name'] }],
      };

      if (search) {
         includeUser.where = {
         [Op.or]: [
            { username: { [Op.iLike]: `%${search}%` } },
            { [`$${alias}.profile.name$`]: { [Op.iLike]: `%${search}%` } },
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
}