import { Injectable } from '@nestjs/common';
import { JwtService as JWT } from '@nestjs/jwt';
import { EXPIRES_ACCESS_TOKEN, EXPIRES_REFRESH_TOKEN } from './jwt.constants';
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  SWAGGER_ACCOUNT_ID,
  SWAGGER_BASIC_AUTH,
} from '../../config';
import {
  GenerateTokenOptions,
  GetUserInfoOptions,
  VerifyTokenOptions,
} from './jwt.typings';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: JWT) {}

  async getUserInfo({ header, ...rest }: GetUserInfoOptions) {
    const authInfo = header.split(' ');
    if (authInfo.length !== 2) return null;
    const bearer = authInfo[0];
    const token = authInfo[1];

    if (
      SWAGGER_ACCOUNT_ID &&
      bearer === 'Basic' &&
      token === SWAGGER_BASIC_AUTH
    ) {
      const user: UserInfo = {
        id: SWAGGER_ACCOUNT_ID,
        role: 'user',
        subscription: null,
      };
      return user;
    }

    if (bearer !== 'Bearer') return null;

    const user = await this.verifyToken({ token, type: 'access', ...rest });
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
            expiresIn: EXPIRES_REFRESH_TOKEN,
            secret: REFRESH_TOKEN_SECRET,
          }
        : {
            expiresIn: EXPIRES_ACCESS_TOKEN,
            secret: ACCESS_TOKEN_SECRET,
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
            secret: REFRESH_TOKEN_SECRET,
          }
        : {
            secret: ACCESS_TOKEN_SECRET,
          };

    try {
      if (!token || typeof token !== 'string') throw new Error();
      const decoded = await this.jwtService.verify(token, options);
      return decoded;
    } catch (e) {
      return null;
    }
  }
}
