import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { Like } from './like.entity';
import { Post } from '../post/post.entity';

@Module({
   imports: [SequelizeModule.forFeature([Like, Post])],
   controllers: [LikeController],
   providers: [LikeService],
   exports: [LikeService],
})
export class LikeModule {}
