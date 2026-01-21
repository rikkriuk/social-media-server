import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Post } from '../post/post.entity';
import { Profile } from '../profile/profile.model';
import { NotificationModule } from '../notification/notification.module';

@Module({
   imports: [
      SequelizeModule.forFeature([
         Comment,
         Post,
         Profile,
      ]),
      NotificationModule,
   ],
   controllers: [CommentController],
   providers: [CommentService],
   exports: [CommentService],
})
export class CommentModule {}
