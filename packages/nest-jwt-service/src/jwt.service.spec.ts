import { Test, TestingModule } from '@nestjs/testing';

import { JwtService } from './jwt.service';
import { JWT_TOKEN } from './jwt.constants';
import { JwtModule } from './jwt.module';
import { ConfigModule, ConfigService, moduleConfig } from './helpers';

describe('JWT service', () => {
  describe('check is defined by all methods', () => {
    it('should be defined sync', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [JwtModule.forRoot(moduleConfig)],
      }).compile();
      const service = module.get<JwtService>(JWT_TOKEN);
      expect(service).toBeDefined();
    });

    it('should be defined async useFactory', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule,
          JwtModule.forRootAsync({
            useFactory: (config: ConfigService) => config.createOptions(),
            inject: [ConfigService],
          }),
        ],
      }).compile();
      const service = module.get<JwtService>(JWT_TOKEN);
      expect(service).toBeDefined();
    });

    it('should be defined async useExisting', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule,
          JwtModule.forRootAsync({
            useExisting: ConfigService,
          }),
        ],
      }).compile();
      const service = module.get<JwtService>(JWT_TOKEN);
      expect(service).toBeDefined();
    });

    it('should be defined async useClass', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          JwtModule.forRootAsync({
            useClass: ConfigService,
          }),
        ],
      }).compile();
      const service = module.get<JwtService>(JWT_TOKEN);
      expect(service).toBeDefined();
    });

    it('should be defined async empty', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [JwtModule.forRootAsync({})],
      }).compile();
      const service = module.get<JwtService>(JWT_TOKEN);
      expect(service).toBeDefined();
    });
  });

  describe('check service', () => {
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
      jwtService = module.get<JwtService>(JWT_TOKEN);
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
        refreshToken = await jwtService.generateToken({
          user,
          type: 'refresh',
        });
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
});
