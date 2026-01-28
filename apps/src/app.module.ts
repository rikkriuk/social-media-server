import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/users/user.model';
import { OtpCode } from './modules/otp/otp.model';
import { Profile } from './modules/profile/profile.model';
import { ProfileModule } from './modules/profile/profile.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './modules/post/post.module';
import { Post } from './modules/post/post.entity';
import { Like } from './modules/like/like.entity';
import { LikeModule } from './modules/like/like.module';
import { Comment } from './modules/comment/comment.entity';
import { Notification } from './modules/notification/notification.entity';
import { UserFollowModule } from './modules/userFollow/userFollow.module';
import { UserFollow } from './modules/userFollow/userFollow.entity';
import { NotificationModule } from './modules/notification/notification.module';
import { CommentModule } from './modules/comment/comment.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432') || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'social_media',
      models: [
        User,
        OtpCode,
        Profile,
        Post,
        Like,
        Comment,
        Notification,
        UserFollow,
      ],
      autoLoadModels: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ProfileModule,
    PostModule,
    LikeModule,
    UserFollowModule,
    NotificationModule,
    CommentModule,
    UploadModule
  ],
})
export class AppModule {}
