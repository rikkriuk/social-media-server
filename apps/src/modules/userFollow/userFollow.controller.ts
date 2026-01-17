import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserFollowService } from "./userFollow.service";
import { CreateFollowDto, CreateUnfollowDto } from "./userFollow.dto";

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
   async count(@Body('userId') userId: string) {
      return this.service.count(userId);
   }

   @Get('followers')
   @ApiOperation({ summary: 'Get followers of a user' })
   async getFollowers(@Body() body: any) {
      return this.service.getFollowers(body);
   }

   @Get('following')
   @ApiOperation({ summary: 'Get following of a user' })
   async getFollowing(@Body() body: any) {
      return this.service.getFollowing(body);
   }
}