import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/users/user.model';
import { OtpCode } from './modules/otp/otp.model';
import { Profile } from './modules/profile/profile.model';
import { ProfileModule } from './modules/profile/profile.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432') || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'social_media',
      models: [User, OtpCode, Profile],
      autoLoadModels: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ProfileModule,
  ],
})
export class AppModule {}
