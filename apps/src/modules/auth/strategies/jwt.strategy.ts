import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
   constructor() {
      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         ignoreExpiration: false,
         secretOrKey: process.env.JWT_SECRET || 'change_this_secret',
      });
   }

   async validate(payload: any) {
      console.log('JWT Strategy received payload:', payload);
      const result = {
         userId: payload.userId,
         profileId: payload.profileId,
         email: payload.email,
      };
      console.log('JWT Strategy returning:', result);
      return result;
   }
}
