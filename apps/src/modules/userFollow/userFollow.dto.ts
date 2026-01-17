import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { PaginationDto } from '../../common/pagination.dto';

export class CreateFollowDto {
  @ApiProperty({ description: 'ID of the follower (UUID)' })
  @IsUUID()
  followerId: string;

  @ApiProperty({ description: 'ID of the user to be followed (UUID)' })
  @IsUUID()
  followingId: string;
}

export class CreateUnfollowDto extends CreateFollowDto {}

export class GetFollowersDto extends PaginationDto {
  @ApiProperty({ description: 'ID of the user whose followers are to be retrieved (UUID)' })
  @IsUUID()
  userId: string;
}

export class GetFollowingDto extends GetFollowersDto {}

export enum FollowType {
  FOLLOWERS = 'followers',
  FOLLOWING = 'following',
}