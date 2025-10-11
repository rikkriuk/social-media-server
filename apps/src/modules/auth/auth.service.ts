import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/user.model';
import { OtpCode } from '../otp/otp.model';
import * as bcrypt from 'bcrypt';

const tokenBlacklist = new Set<string>();

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(OtpCode) private otpModel: typeof OtpCode,
    private jwtService: JwtService,
  ) {}

  async signup(data: { email?: string; phoneNumber?: string; username?: string; password: string }) {
    if (data.email) {
      const exists = await this.userModel.findOne({ where: { email: data.email } });
      if (exists) throw new HttpException('Email already in use', HttpStatus.CONFLICT);
    }
    if (data.phoneNumber) {
      const exists = await this.userModel.findOne({ where: { phoneNumber: data.phoneNumber } });
      if (exists) throw new HttpException('Phone number already in use', HttpStatus.CONFLICT);
    }
    if (data.username) {
      const exists = await this.userModel.findOne({ where: { username: data.username } });
      if (exists) throw new HttpException('Username already in use', HttpStatus.CONFLICT);
    }

    const hash = await bcrypt.hash(data.password, 10);
    const user = await this.userModel.create({
      email: data.email,
      phoneNumber: data.phoneNumber,
      username: data.username,
      password: hash,
    });

    // create OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await this.otpModel.create({ userId: user.id, code, expiresAt });

    // In a real app you'd send SMS/email. Return OTP for dev/testing.
    return { userUuid: user.uuid, otp: code };
  }

  async verifyOtp(userId: string, code: string) {
    const user = await this.userModel.findOne({ where: { uuid: userId } });
    if (!user) return null;
    const otp = await this.otpModel.findOne({ where: { userId: user.id, code, verified: false, used: false } });
    if (!otp) return null;
    if (otp.expiresAt < new Date()) return null;
    otp.verified = true;
    otp.used = true;
    await otp.save();

    // create profile if not exists
    const Profile = require('../profile/profile.model').Profile;
    const existing = await Profile.findOne({ where: { userId: user.id } });
    if (!existing) {
      await Profile.create({ userId: user.id });
    }

    const token = this.jwtService.sign({ sub: user.uuid });
    return { userId: user.uuid, token };
  }

  async login(identifier: string, password: string) {
    // identifier can be email or phone or username
    const user = await this.userModel.findOne({
      where: {
        // sequelize OR requires more setup; we'll try find by email then phone then username
      },
    });

    const byEmail = await this.userModel.findOne({ where: { email: identifier } });
    const byPhone = await this.userModel.findOne({ where: { phoneNumber: identifier } });
    const byUsername = await this.userModel.findOne({ where: { username: identifier } });

    const found = byEmail || byPhone || byUsername;
    if (!found) return null;

    const match = await bcrypt.compare(password, found.password);
    if (!match) return null;

    const token = this.jwtService.sign({ sub: found.uuid });
    return { token };
  }

  async resendOtp(userId: string) {
    const user = await this.userModel.findOne({ where: { uuid: userId } });
    if (!user) return null;
    // invalidate previous OTPs for safety
    await this.otpModel.update({ used: true }, { where: { userId: user.id, verified: false } });
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await this.otpModel.create({ userId: user.id, code, expiresAt });
    return { userId: user.uuid, otp: code };
  }

  async listUsers() {
    const users = await this.userModel.findAll({ attributes: ['uuid', 'email', 'phoneNumber', 'username', 'createdAt'] });
    return users;
  }

  logout(token: string) {
    tokenBlacklist.add(token);
    return { success: true };
  }

  isBlacklisted(token: string) {
    return tokenBlacklist.has(token);
  }
}
