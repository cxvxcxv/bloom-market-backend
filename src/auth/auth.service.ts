import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { verify } from 'argon2';
import { Response } from 'express';
import { CartService } from 'src/cart/cart.service';
import { UserService } from 'src/user/user.service';
import {
  REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRATION_DAYS,
} from './../constants/auth.constants';
import { AuthUserDto } from './dto/auth-user.dto';
import { IJwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly cartService: CartService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(authUserDto: AuthUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = await this.userService.create(authUserDto);
    const tokens = this.issueTokens(user);

    await this.cartService.createCart(user.id);

    return { user, ...tokens };
  }

  async login(authUserDto: AuthUserDto) {
    const user: User = await this.userService.findOne(authUserDto.email);
    if (!user || !(await verify(user.password, authUserDto.password)))
      throw new UnauthorizedException('invalid credentials');

    return this.issueTokens(user);
  }

  async refreshTokens(refreshToken: string) {
    const result = await this.jwtService.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('invalid refresh token');

    const user = await this.userService.findOne(result.id);
    if (!user) throw new NotFoundException('user not found');

    const tokens = this.issueTokens({ id: user.id, email: user.email });

    return tokens;
  }

  private issueTokens(payload: IJwtPayload) {
    const accessToken = 'Bearer ' + this.jwtService.sign(payload);
    const refreshToken =
      'Bearer ' +
      this.jwtService.sign(payload, {
        expiresIn: `${REFRESH_TOKEN_EXPIRATION_DAYS}d`,
      });

    return { accessToken, refreshToken };
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    refreshToken = refreshToken.slice(7);

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
