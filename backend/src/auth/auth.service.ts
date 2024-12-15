import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  private isProd: boolean;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    this.isProd = this.configService.get<string>('NODE_ENV') === 'production';
  }

  async signIn(info: SignInDto, res: Response) {
    try {
      const { id, password } = info;

      const user = await this.userService.findOneUser(id);

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new UnauthorizedException({
          errorCode: 'PASSWORD_MISMATCH',
          message: '비밀번호가 일치하지 않습니다.',
        });
      }

      const payload = { id };

      const accessTokenMaxAge = 5 * 60 * 1000;
      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: accessTokenMaxAge,
      });

      const refreshTokenMaxAge = 14 * 24 * 60 * 60 * 1000;
      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: refreshTokenMaxAge,
      });

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: this.isProd,
        sameSite: this.isProd ? 'strict' : 'none',
        maxAge: accessTokenMaxAge,
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: this.isProd,
        sameSite: this.isProd ? 'strict' : 'none',
        maxAge: refreshTokenMaxAge,
      });

      return { success: true };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      console.error('예상치 못한 에러 signIn', error);
      throw new UnauthorizedException({
        errorCode: 'UNEXPECTED_SIGNIN_ERROR',
        message:
          '서버 문제로 인하여 로그인에 실패했습니다. 잠시 후 다시 시도해 주시기 바랍니다.',
      });
    }
  }
}
