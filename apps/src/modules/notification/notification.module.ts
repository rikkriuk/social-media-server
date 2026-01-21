import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Profile } from '../profile/profile.model';
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';

@Module({
   imports: [
      SequelizeModule.forFeature([
         Notification,
         Profile,
         Post,
         Comment,
      ]),
   ],
   controllers: [NotificationController],
   providers: [NotificationService],
   exports: [NotificationService],
})
export class NotificationModule {}
