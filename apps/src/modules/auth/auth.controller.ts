import { Controller, Post, Body, Req, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ResendDto } from './dto/resend.dto';

class TokenResponse {
  token: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user (creates OTP for verification)' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({ status: 201, description: 'User created. OTP returned for testing.' })
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify OTP and get bearer token' })
  @ApiBody({ type: VerifyDto })
  @ApiResponse({ status: 200, description: 'Returns JWT token', type: TokenResponse })
  async verify(@Body() dto: VerifyDto) {
    return this.authService.verifyOtp(dto.userId, dto.code);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email/phone/username and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Returns JWT token', type: TokenResponse })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.identifier, dto.password);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout (blacklist token)' })
  @ApiResponse({ status: 200, description: 'Logout success' })
  async logout(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.authService.logout(token);
  }

  @Post('resend')
  @ApiOperation({ summary: 'Resend OTP to user' })
  @ApiBody({ type: ResendDto })
  @ApiResponse({ status: 200, description: 'OTP resent (returned for dev)' })
  async resend(@Body() dto: ResendDto) {
    return this.authService.resendOtp(dto.userId);
  }
}
