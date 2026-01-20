import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LikeService } from './like.service';
import { CreateLikeDto, UnlikeDto, GetLikesDto, CheckLikeDto } from './like.dto';

@ApiTags('Likes')
@Controller('likes')
export class LikeController {
   constructor(private service: LikeService) {}

   @Post('like')
   @ApiOperation({ summary: 'Like a post' })
   async likePost(@Body() body: CreateLikeDto) {
      return this.service.likePost(body);
   }

   @Post('unlike')
   @ApiOperation({ summary: 'Unlike a post' })
   async unlikePost(@Body() body: UnlikeDto) {
      return this.service.unlikePost(body);
   }

   @Get()
   @ApiOperation({ summary: 'Get likes for a post' })
   async getLikes(@Query() query: GetLikesDto) {
      return this.service.getLikes(query);
   }

   @Get('check')
   @ApiOperation({ summary: 'Check if user has liked a post' })
   async checkLike(@Query() query: CheckLikeDto) {
      return this.service.checkLike(query);
   }
}
