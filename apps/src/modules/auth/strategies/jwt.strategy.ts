import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from '../../../modules/profile/profile.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
   constructor(
      @InjectModel(Profile) private profileModel: typeof Profile,
   ) {
      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         ignoreExpiration: false,
         secretOrKey: process.env.JWT_SECRET || 'change_this_secret',
      });
   }

   async validate(payload: any) {
      const userId = payload.userId || payload.sub;
      
      let profileId = payload.profileId;
      if (!profileId && userId) {
         try {
            let profile = await this.profileModel.findOne({ where: { userId } });
            
            if (!profile) {
               profile = await this.profileModel.create({ userId });
            }
            
            profileId = profile?.id;
         } catch (error) {
            console.error('Error fetching/creating profile in JWT strategy:', error);
         }
      }
      
      const result = {
         userId: userId,
         profileId: profileId,
         email: payload.email,
      };

      return result;
   }
}
