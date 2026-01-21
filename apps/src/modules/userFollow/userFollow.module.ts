import { Module } from "@nestjs/common";
import { UserFollowController } from "./userFollow.controller";
import { UserFollowService } from "./userFollow.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserFollow } from "./userFollow.entity";
import { User } from "../users/user.model";
import { Profile } from "../profile/profile.model";
import { NotificationModule } from "../notification/notification.module";

@Module({
   imports: [
      SequelizeModule.forFeature([
         UserFollow,
         User,
         Profile,
      ]),
      NotificationModule,
   ],
   controllers: [UserFollowController],
   providers: [UserFollowService],
   exports: [],
})
export class UserFollowModule {}