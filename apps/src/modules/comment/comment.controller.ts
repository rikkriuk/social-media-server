import { Body, Controller, Delete, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './comment.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
   constructor(private service: CommentService) {}

   @Post()
   @UseGuards(AuthGuard('jwt'))
   @ApiOperation({ summary: 'Create a comment on a post' })
   async createComment(@Request() req: any, @Body() dto: CreateCommentDto) {
      const profileId = req.user.profileId;
      return this.service.createComment({
         ...dto,
         profileId,
      });
   }

   @Get('post/:postId')
   @ApiOperation({ summary: 'Get comments for a post' })
   async getCommentsByPost(
      @Param('postId') postId: string,
      @Query('limit') limit: string = '10',
      @Query('offset') offset: string = '0',
   ) {
      return this.service.getCommentsByPost(postId, parseInt(limit), parseInt(offset));
   }

   @Delete(':id')
   @UseGuards(AuthGuard('jwt'))
   @ApiOperation({ summary: 'Delete a comment' })
   async deleteComment(@Request() req: any, @Param('id') commentId: string) {
      const profileId = req.user.profileId;
      await this.service.deleteComment(commentId, profileId);
      return { message: 'Comment deleted successfully' };
   }
}
