import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserFollowService } from "./userFollow.service";
import {
   CreateFollowDto,
   CreateUnfollowDto,
   GetFollowersDto,
   GetFollowingDto,
   GetSuggestionsDto,
   SearchUsersDto,
   CheckFollowDto
} from "./userFollow.dto";

@ApiTags('User Follows')
@Controller('user-follows')
export class UserFollowController {
   constructor(private service: UserFollowService) {}

   @Post('follow')
   @ApiOperation({ summary: 'Follow a user' })
   async followUser(@Body() body: CreateFollowDto) {
      return this.service.followUser(body);
   }

   @Post('unfollow')
   @ApiOperation({ summary: 'Unfollow a user' })
   async unfollowUser(@Body() body: CreateUnfollowDto) {
      return this.service.unfollowUser(body);
   }

   @Get('count/:userId')
   @ApiOperation({ summary: 'Get follower and following count for a user' })
   @ApiParam({ name: 'userId', required: true, type: String })
   async count(@Param('userId') userId: string) {
      return this.service.count(userId);
   }

   @Get('followers')
   @ApiOperation({ summary: 'Get followers of a user' })
   async getFollowers(@Query() query: GetFollowersDto) {
      return this.service.getFollowers(query);
   }

   @Get('following')
   @ApiOperation({ summary: 'Get following of a user' })
   async getFollowing(@Query() query: GetFollowingDto) {
      return this.service.getFollowing(query);
   }

   @Get('suggestions')
   @ApiOperation({ summary: 'Get suggested users to follow' })
   async getSuggestions(@Query() query: GetSuggestionsDto) {
      return this.service.getSuggestions(query);
   }

   @Get('search')
   @ApiOperation({ summary: 'Search users by username or name' })
   async searchUsers(@Query() query: SearchUsersDto) {
      return this.service.searchUsers(query);
   }

   @Get('check')
   @ApiOperation({ summary: 'Check if user is following another user' })
   async checkIsFollowing(@Query() query: CheckFollowDto) {
      return this.service.checkIsFollowing(query.followerId, query.followingId);
   }
}