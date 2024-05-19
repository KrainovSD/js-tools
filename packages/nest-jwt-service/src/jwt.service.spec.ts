import { Test, TestingModule } from '@nestjs/testing';

import { JwtService } from './jwt.service';
import { JWT_PROVIDER_MODULE } from './jwt.constants';
import { JwtModule } from './jwt.module';

describe('JWT service', () => {
  let jwtService: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.forRoot({
          accessTokenSecret: 'access',
          refreshTokenSecret: 'refresh',
          expiresAccessToken: '24d',
          expiresRefreshToken: '24d',
        }),
      ],
      providers: [],
    }).compile();
    jwtService = module.get<JwtService>(JWT_PROVIDER_MODULE);
  });

  it('jwt service should be defined', () => {
    expect(jwtService).toBeDefined();
  });

  const user: UserInfo = {
    id: '1',
    role: 'user',
    subscription: null,
  };
  let accessToken: string;
  let refreshToken: string;

  describe('generateToken', () => {
    it('gen access token', async () => {
      accessToken = await jwtService.generateToken({ user, type: 'access' });
      expect(typeof accessToken).toBe('string');
    });
    it('get refresh token', async () => {
      refreshToken = await jwtService.generateToken({ user, type: 'refresh' });
      expect(typeof refreshToken).toBe('string');
    });
  });
  describe('verifyToken', () => {
    it('get by correct access token', async () => {
      await expect(
        jwtService.verifyToken({ token: accessToken, type: 'access' }),
      ).resolves.toEqual(user);
    });
    it('get by incorrect access token', async () => {
      await expect(
        jwtService.verifyToken({ token: refreshToken, type: 'access' }),
      ).resolves.toBeNull();
    });
    it('get by correct refresh token', async () => {
      await expect(
        jwtService.verifyToken({ token: refreshToken, type: 'refresh' }),
      ).resolves.toEqual(user);
    });
    it('get by incorrect refresh token', async () => {
      await expect(
        jwtService.verifyToken({ token: accessToken, type: 'refresh' }),
      ).resolves.toBeNull();
    });
    it('without token', async () => {
      await expect(
        jwtService.verifyToken({ token: null, type: 'refresh' }),
      ).resolves.toBeNull();
    });
  });
  describe('getUserInfo', () => {
    it('get from header with correct token', async () => {
      await expect(
        jwtService.getUserInfo({ header: `Bearer ${accessToken}` }),
      ).resolves.toEqual(user);
    });
    it('get from header with incorrect token', async () => {
      await expect(
        jwtService.getUserInfo({ header: `Bearer ${refreshToken}` }),
      ).resolves.toBeNull();
    });
    it('get from header with incorrect header token type', async () => {
      await expect(
        jwtService.getUserInfo({ header: `Test ${refreshToken}` }),
      ).resolves.toBeNull();
    });
    it('get from header without header token type', async () => {
      await expect(
        jwtService.getUserInfo({ header: refreshToken }),
      ).resolves.toBeNull();
    });
    it('get from cookie with correct token', async () => {
      await expect(
        jwtService.getUserInfo({ cookie: accessToken }),
      ).resolves.toEqual(user);
    });
    it('get from cookie with incorrect token', async () => {
      await expect(
        jwtService.getUserInfo({ cookie: refreshToken }),
      ).resolves.toBeNull();
    });
    it('without header and cookie', async () => {
      await expect(jwtService.getUserInfo({})).resolves.toBeNull();
    });
  });
});
