import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PostResponseDto } from '../post.dto';

export function GetPostResponse() {
   return applyDecorators(
      ApiResponse({ status: 200, description: 'Post fetched', type: PostResponseDto }),
      ApiResponse({ status: 404, description: 'Post not found' }),
   );
}

export function UpdatePostResponse() {
   return applyDecorators(
      ApiResponse({ status: 200, description: 'Post updated', type: PostResponseDto }),
      ApiResponse({ status: 403, description: 'Forbidden - can only update own posts' }),
      ApiResponse({ status: 404, description: 'Post not found' }),
   );
}

export function DeletePostResponse() {
   return applyDecorators(
      ApiResponse({ status: 200, description: 'Post deleted' }),
      ApiResponse({ status: 403, description: 'Forbidden - can only delete own posts' }),
      ApiResponse({ status: 404, description: 'Post not found' }),
   );
}
