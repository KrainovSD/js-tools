import { Inject, Injectable } from '@nestjs/common';
import { JwtService as JWT } from '@nestjs/jwt';

import {
  GenerateTokenOptions,
  GetUserInfoOptions,
  VerifyTokenOptions,
} from './jwt.typings';
import { JWT_OPTIONS_TOKEN } from './jwt.constants';
import { JwtModuleOptions } from './jwt.interfaces';

@Injectable()
export class JwtService {
  private EXPIRES_ACCESS_TOKEN: string;
  private EXPIRES_REFRESH_TOKEN: string;
  private ACCESS_TOKEN_SECRET: string;
  private REFRESH_TOKEN_SECRET: string;

  constructor(
    @Inject(JWT_OPTIONS_TOKEN) private options: JwtModuleOptions,
    private readonly jwtService: JWT,
  ) {
    this.EXPIRES_ACCESS_TOKEN = options.expiresAccessToken;
    this.EXPIRES_REFRESH_TOKEN = options.expiresRefreshToken;
    this.ACCESS_TOKEN_SECRET = options.accessTokenSecret;
    this.REFRESH_TOKEN_SECRET = options.refreshTokenSecret;
  }

  private async getUserInfoFromHeader(header?: string) {
    if (!header) return null;

    const authInfo = header.split(' ');
    if (authInfo.length !== 2) return null;
    const bearer = authInfo[0];
    const token = authInfo[1];

    if (bearer !== 'Bearer') return null;
    return this.verifyToken({ token, type: 'access' });
  }
  private async getUserInfoFromCookie(cookie?: string) {
    if (!cookie) return null;
    return this.verifyToken({ token: cookie, type: 'access' });
  }

  async getUserInfo({ header, cookie }: GetUserInfoOptions) {
    if (!header && !cookie) return null;

    let user: UserInfo | null = await this.getUserInfoFromHeader(header);
    if (!user) {
      user = await this.getUserInfoFromCookie(cookie);
    }

    if (user && user.subscription) {
      user.subscription = new Date(user.subscription);
    }

    return user;
  }
  async generateToken({ user, type }: GenerateTokenOptions) {
    const payload = {
      id: user.id,
      role: user.role,
      subscription: user.subscription,
    };
    const options =
      type === 'refresh'
        ? {
            expiresIn: this.EXPIRES_REFRESH_TOKEN,
            secret: this.REFRESH_TOKEN_SECRET,
          }
        : {
            expiresIn: this.EXPIRES_ACCESS_TOKEN,
            secret: this.ACCESS_TOKEN_SECRET,
          };
    return this.jwtService.sign(payload, options);
  }
  async verifyToken({
    token,
    type,
  }: VerifyTokenOptions): Promise<UserInfo | null> {
    const options =
      type === 'refresh'
        ? {
            secret: this.REFRESH_TOKEN_SECRET,
          }
        : {
            secret: this.ACCESS_TOKEN_SECRET,
          };

    try {
      if (!token || typeof token !== 'string') throw new Error();
      const decoded = await this.jwtService.verify(token, options);

      if (decoded && 'exp' in decoded) {
        delete decoded.exp;
      }
      if (decoded && 'iat' in decoded) {
        delete decoded.iat;
      }

      return decoded;
    } catch (e) {
      return null;
    }
  }
}
