import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
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
  @IsString()
  userId: string;
}

export class GetFollowingDto extends GetFollowersDto {}

export class GetSuggestionsDto extends PaginationDto {
  @ApiProperty({ description: 'ID of the current user (UUID)' })
  @IsString()
  userId: string;
}

export class SearchUsersDto extends PaginationDto {
  @ApiProperty({ description: 'Search query for username or name' })
  @IsString()
  search: string;

  @ApiPropertyOptional({ description: 'ID of the current user to exclude from results (UUID)' })
  @IsOptional()
  @IsString()
  currentUserId?: string;
}

export class CheckFollowDto {
  @ApiProperty({ description: 'ID of the follower (UUID)' })
  @IsString()
  followerId: string;

  @ApiProperty({ description: 'ID of the user being followed (UUID)' })
  @IsString()
  followingId: string;
}

export enum FollowType {
  FOLLOWERS = 'followers',
  FOLLOWING = 'following',
}