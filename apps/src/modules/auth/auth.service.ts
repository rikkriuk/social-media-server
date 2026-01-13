import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/user.model';
import { OtpCode } from '../otp/otp.model';
import * as bcrypt from 'bcrypt';
import { IdentifierType, LoginDto } from './dto/login.dto';
import { generateOtp } from 'apps/src/helpers/otp';
import { Profile } from '../profile/profile.model';

const tokenBlacklist = new Set<string>();

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(OtpCode) private otpModel: typeof OtpCode,
    @InjectModel(Profile) private profileModel: typeof Profile,
    private jwtService: JwtService,
  ) {}

  async signup(data: { email?: string; phoneNumber?: string; username?: string; password: string }) {
    await this.checkUniques({
      email: data.email,
      phoneNumber: data.phoneNumber,
      username: data.username,
    });

    const hash = await bcrypt.hash(data.password, 10);
    const user = await this.userModel.create({
      email: data.email,
      phoneNumber: data.phoneNumber,
      username: data.username,
      password: hash,
    });

    // create OTP
    const otp = generateOtp();
    await this.otpModel.create({
      userId: user.id,
      code: otp.code,
      expiresAt: otp.expiresAt,
    });

    return { userId: user.id, otp: otp.code };
  }

  async verifyOtp(userId: string, code: string) {
    const user = await this.userModel.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    };

    const otp = await this.otpModel.findOne({ 
      where: { 
        userId: user.id, 
        code,
        // verified: false, 
        // used: false 
      } 
    });

    console.log("OTP:", otp,user.id, code);
    await this.getValidOtpOrFail(otp);

    otp.verified = true;
    otp.used = true;
    await otp.save();

    const existing = this.profileModel.findOne({ where: { userId: user.id } });
    if (!existing) {
      await this.profileModel.create({ userId: user.id });
    }

    this.userModel.update({ isVerified: true }, { 
      where: { id: user.id } 
    });

    const token = this.jwtService.sign({ sub: user.id });
    return { userId: user.id, token };
  }

  async login(data: LoginDto) {
    const { identifier, identifierType, password } = data;

    let user = null;

    const getIdentifierType = (identifierType, whereClause) => {
      switch (identifierType) {
        case IdentifierType.EMAIL:
          whereClause = { email: identifier };
          break;
        case IdentifierType.PHONE:
          whereClause = { phoneNumber: identifier };
          break;
        case IdentifierType.USERNAME:
          whereClause = { username: identifier };
          break;
      }

      return whereClause;
    }

    if (identifierType) {
      let whereClause = {};
      whereClause = getIdentifierType(identifierType, whereClause);

      user = await this.userModel.findOne({ where: whereClause });
      if (!user) {
        throw new HttpException(`Invalid ${identifier} or Password`, HttpStatus.BAD_REQUEST);
      }
    }

    if (!user.isVerified) {
      const { code, expiresAt } = generateOtp();

      await this.otpModel.create({
        userId: user.id,
        code,
        expiresAt,
      });

      return {
        requiresVerification: true,
        userId: user.id,
        otp: code
      };
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    const token = this.jwtService.sign({ sub: user.id });
    return { token };
  }

  async resendOtp(userId: string) {
    const user = await this.userModel.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const { code, expiresAt } = generateOtp();

    const [updated] = await this.otpModel.update(
      {
        code,
        expiresAt,
        verified: false,
        used: false,
      },
      {
        where: {
          userId,
          verified: false,
        },
      },
    );

    if (updated === 0) {
      await this.otpModel.create({
        userId,
        code,
        expiresAt,
      });
    }

    return { userId, otp: code };
  }

  async listUsers() {
    const users = await this.userModel.findAll({ 
      attributes: ['id', 'email', 'phoneNumber', 'username', 'createdAt'] 
    });
    return users;
  }

  // Forgot password: generate OTP and (for dev) return it. In prod, send via email/SMS.
  async forgotPassword(identifier: string) {
    const byEmail = await this.userModel.findOne({ where: { email: identifier } });
    const byPhone = await this.userModel.findOne({ where: { phoneNumber: identifier } });
    const user = byEmail || byPhone;
    if (!user) return null;

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await this.otpModel.create({ userId: user.id, code, expiresAt });

    // In production, send code via email/SMS. For now return for dev/testing.
    return { userId: user.id, otp: code };
  }

  // Reset password using OTP
  async resetPassword(userId: string, code: string, newPassword: string) {
    const user = await this.userModel.findOne({ where: { id: userId } });
    if (!user) return null;

    const otp = await this.otpModel.findOne({ where: { userId: user.id, code, verified: false, used: false } });
    if (!otp) return null;
    if (otp.expiresAt < new Date()) return null;

    // mark used
    otp.used = true;
    otp.verified = true;
    await otp.save();

    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();

    const token = this.jwtService.sign({ sub: user.id });
    return { token };
  }

  private async checkUniques(data: {
    email?: string;
    phoneNumber?: string;
    username?: string;
  }) {
    const fields = Object.entries(data).filter(([, v]) => v);

    const handleExist = (field: string) => {
      throw new HttpException(
        `${this.prettyFieldName(field)} already in use`,
        HttpStatus.CONFLICT,
      );
    }

    for (const [field, value] of fields) {
      const exists = await this.userModel.findOne({
        where: { [field]: value },
      });

      if (exists) return handleExist(field)
    }
  }

  private prettyFieldName(field: string) {
    switch (field) {
      case 'phoneNumber':
        return 'Phone number';
      default:
        return field.charAt(0).toUpperCase() + field.slice(1);
    }
  }

  private async getValidOtpOrFail(otp: any) {

    if (!otp) {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }

    if (otp.verified) {
      throw new HttpException('OTP already verified', HttpStatus.BAD_REQUEST);
    }

    if (otp.expiresAt < new Date()) {
      throw new HttpException('OTP expired', HttpStatus.BAD_REQUEST);
    }

    return otp;
  }

  logout(token: string) {
    tokenBlacklist.add(token);
    return { success: true };
  }

  isBlacklisted(token: string) {
    return tokenBlacklist.has(token);
  }
}
