import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto, PostResponseDto, PaginationQueryDto } from './post.dto';
import {
  GetPostResponse,
  UpdatePostResponse,
  DeletePostResponse,
} from './decorators/api-responses.decorator';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
   constructor(private readonly postService: PostService) {}

   @Post()
   @UseGuards(AuthGuard('jwt'))
   @ApiBearerAuth()
   @ApiOperation({ summary: 'Create a new post' })
   @ApiResponse({ status: 201, description: 'Post created', type: PostResponseDto })
   async createPost(@Request() req: any, @Body() createPostDto: CreatePostDto) {
      console.log('Full req.user:', req.user);
      const profileId = req.user.profileId;
      return this.postService.createPost(profileId, createPostDto);
   }

   @Get()
   @ApiOperation({ summary: 'Get all posts with pagination' })
   @ApiResponse({ status: 200, description: 'Posts fetched' })
   async getPosts(@Query() query: PaginationQueryDto) {
      return this.postService.getPosts(query.limit, query.offset);
   }

   @Get('user/:userId')
   @ApiOperation({ summary: 'Get posts from a specific user' })
   @ApiResponse({ status: 200, description: 'User posts fetched' })
   async getUserPosts(
      @Param('userId') userId: string,
      @Query() query: PaginationQueryDto,
   ) {
      return this.postService.getUserPosts(userId, query.limit, query.offset);
   }

   @Get(':id')
   @GetPostResponse()
   @ApiOperation({ summary: 'Get post by ID' })
   async getPostById(@Param('id') id: string) {
      return this.postService.getPostById(id);
   }

   @Patch(':id')
   @UseGuards(AuthGuard('jwt'))
   @ApiBearerAuth()
   @UpdatePostResponse()
   @ApiOperation({ summary: 'Update post' })
   async updatePost(
      @Request() req: any,
      @Param('id') id: string,
      @Body() updatePostDto: UpdatePostDto,
   ) {
      const profileId = req.user.profileId;
      return this.postService.updatePost(id, profileId, updatePostDto);
   }

   @Delete(':id')
   @UseGuards(AuthGuard('jwt'))
   @ApiBearerAuth()
   @DeletePostResponse()
   @ApiOperation({ summary: 'Delete post' })
   async deletePost(@Request() req: any, @Param('id') id: string) {
      const profileId = req.user.profileId;
      return this.postService.deletePost(id, profileId);
   }
}
