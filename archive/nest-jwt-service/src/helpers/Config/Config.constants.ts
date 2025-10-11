import { JwtModuleOptions } from '../../jwt.interfaces';

export const moduleConfig: JwtModuleOptions = {
  accessTokenSecret: 'access',
  refreshTokenSecret: 'refresh',
  expiresAccessToken: '1d',
  expiresRefreshToken: '1d',
};
