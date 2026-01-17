import { Module } from "@nestjs/common";
import { UserFollowController } from "./userFollow.controller";
import { UserFollowService } from "./userFollow.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserFollow } from "./userFollow.entity";

@Module({
   imports: [SequelizeModule.forFeature([
      UserFollow,
   ])],
   controllers: [UserFollowController],
   providers: [UserFollowService],
   exports: [],
})
export class UserFollowModule {}