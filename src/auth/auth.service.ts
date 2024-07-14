import { ConfigService } from '@nestjs/config';
import {
  REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRATION_DAYS,
} from './../constants/auth.constants';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { User } from '@prisma/client';
import { verify } from 'argon2';
import { IJwtPayload } from './types';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(authUserDto: AuthUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = await this.userService.create(authUserDto);
    const tokens = this.issueTokens(user);
    return { user, ...tokens };
  }

  async login(authUserDto: AuthUserDto) {
    const user: User = await this.userService.findOne(authUserDto.email);
    if (!user || !(await verify(user.password, authUserDto.password)))
      throw new UnauthorizedException('invalid credentials');

    return this.issueTokens(user);
  }

  async refreshTokens(refreshToken: string) {
    refreshToken = refreshToken.slice(7); //removing 'Bearer '
    const result = await this.jwtService.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('invalid refresh token');

    const user = await this.userService.findOne(result.id);
    const tokens = this.issueTokens({ id: user.id, email: user.email });
    console.log(tokens);

    return tokens;
  }

  private issueTokens(payload: IJwtPayload) {
    const accessToken = 'Bearer ' + this.jwtService.sign(payload);
    const refreshToken =
      'Bearer ' + this.jwtService.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + REFRESH_TOKEN_EXPIRATION_DAYS);

    res.cookie(REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      domain: this.configService.get('DOMAIN'),
      expires: expiresIn,
      secure: true,
      sameSite:
        this.configService.get('NODE') === 'production' ? 'lax' : 'none',
    });
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(REFRESH_TOKEN, '', {
      httpOnly: true,
      domain: this.configService.get('DOMAIN'),
      expires: new Date(0),
      secure: true,
      sameSite:
        this.configService.get('NODE') === 'production' ? 'lax' : 'none',
    });
  }
}
