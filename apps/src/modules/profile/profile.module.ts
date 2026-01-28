import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Profile } from './profile.model';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { UploadService } from '../../common/upload.service';

@Module({
  imports: [SequelizeModule.forFeature([Profile])],
  providers: [ProfileService, UploadService],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
