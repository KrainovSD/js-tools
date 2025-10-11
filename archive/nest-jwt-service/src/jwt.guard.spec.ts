import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { JwtService } from './jwt.service';
import { AuthGuard } from './jwt.guard';
import { JWT_TOKEN } from './jwt.constants';
import { JwtModule } from './jwt.module';

describe('JWT Guard', () => {
  const httpContext = (requestInstance: unknown) => ({
    getRequest: jest.fn(() => requestInstance),
  });
  const host = (httpContextInstance: unknown) =>
    ({
      switchToHttp: jest.fn(() => httpContextInstance),
    }) as unknown as ExecutionContext;

  describe('canActive with array roles', () => {
    let guard: CanActivate;
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
        providers: [
          {
            provide: 'guard',
            useClass: AuthGuard({
              roles: ['user', 'admin'],
            }),
          },
        ],
      }).compile();
      guard = module.get<CanActivate>('guard');
      jwtService = module.get<JwtService>(JWT_TOKEN);
    });

    it('guard should be defined', () => {
      expect(guard).toBeDefined();
    });
    it('jwt service should be defined', () => {
      expect(jwtService).toBeDefined();
    });

    it('bad role', async () => {
      const user: UserInfo = {
        id: '1',
        role: 'test',
        subscription: new Date(Date.now() + 1000 * 60 * 60 * 24),
      };
      const token = await jwtService.generateToken({ user, type: 'access' });
      const request = {
        headers: { authorization: `Bearer ${token}` },
      };

      await expect(
        guard.canActivate(host(httpContext(request))),
      ).rejects.toThrow(ForbiddenException);
    });

    it('normal role', async () => {
      const user: UserInfo = {
        id: '1',
        role: 'user',
        subscription: new Date(Date.now() + 1000 * 60 * 60 * 24),
      };
      const token = await jwtService.generateToken({ user, type: 'access' });
      const request = {
        headers: { authorization: `Bearer ${token}` },
      };

      await expect(
        guard.canActivate(host(httpContext(request))),
      ).resolves.toBeTruthy();
    });
  });
  describe('canActive with string roles', () => {
    let guard: CanActivate;
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
        providers: [
          {
            provide: 'guard',
            useClass: AuthGuard({
              roles: 'user',
            }),
          },
        ],
      }).compile();
      guard = module.get<CanActivate>('guard');
      jwtService = module.get<JwtService>(JWT_TOKEN);
    });

    it('guard should be defined', () => {
      expect(guard).toBeDefined();
    });
    it('jwt service should be defined', () => {
      expect(jwtService).toBeDefined();
    });

    it('bad role', async () => {
      const user: UserInfo = {
        id: '1',
        role: 'admin',
        subscription: new Date(Date.now() + 1000 * 60 * 60 * 24),
      };
      const token = await jwtService.generateToken({ user, type: 'access' });
      const request = {
        headers: { authorization: `Bearer ${token}` },
      };

      await expect(
        guard.canActivate(host(httpContext(request))),
      ).rejects.toThrow(ForbiddenException);
    });

    it('normal role', async () => {
      const user: UserInfo = {
        id: '1',
        role: 'user',
        subscription: new Date(Date.now() + 1000 * 60 * 60 * 24),
      };
      const token = await jwtService.generateToken({ user, type: 'access' });
      const request = {
        headers: { authorization: `Bearer ${token}` },
      };

      await expect(
        guard.canActivate(host(httpContext(request))),
      ).resolves.toBeTruthy();
    });
  });
  describe('canActive with sub', () => {
    let guard: CanActivate;
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
        providers: [
          {
            provide: 'guard',
            useClass: AuthGuard({
              subscription: true,
            }),
          },
        ],
      }).compile();
      guard = module.get<CanActivate>('guard');
      jwtService = module.get<JwtService>(JWT_TOKEN);
    });

    it('guard should be defined', () => {
      expect(guard).toBeDefined();
    });
    it('jwt service should be defined', () => {
      expect(jwtService).toBeDefined();
    });

    it('bad subscription', async () => {
      const user: UserInfo = {
        id: '1',
        role: 'user',
        subscription: new Date(Date.now() - 1000 * 60 * 60 * 24),
      };
      const token = await jwtService.generateToken({ user, type: 'access' });
      const request = {
        headers: { authorization: `Bearer ${token}` },
      };

      await expect(
        guard.canActivate(host(httpContext(request))),
      ).rejects.toThrow(ForbiddenException);
    });
    it('normal subscription', async () => {
      const user: UserInfo = {
        id: '1',
        role: 'user',
        subscription: new Date(Date.now() + 1000 * 60 * 60 * 24),
      };
      const token = await jwtService.generateToken({ user, type: 'access' });
      const request = {
        headers: { authorization: `Bearer ${token}` },
      };

      await expect(
        guard.canActivate(host(httpContext(request))),
      ).resolves.toBeTruthy();
    });
  });
  describe('canActive without options', () => {
    let guard: CanActivate;
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
        providers: [
          {
            provide: 'guard',
            useClass: AuthGuard(),
          },
        ],
      }).compile();
      guard = module.get<CanActivate>('guard');
      jwtService = module.get<JwtService>(JWT_TOKEN);
    });

    it('guard should be defined', () => {
      expect(guard).toBeDefined();
    });
    it('jwt service should be defined', () => {
      expect(jwtService).toBeDefined();
    });

    it('expired sub', async () => {
      const user: UserInfo = {
        id: '1',
        role: 'test',
        subscription: new Date(Date.now() - 1000 * 60 * 60 * 24),
      };
      const token = await jwtService.generateToken({ user, type: 'access' });
      const request = {
        headers: { authorization: `Bearer ${token}` },
      };

      await expect(
        guard.canActivate(host(httpContext(request))),
      ).resolves.toBeTruthy();
    });
    it('null sub', async () => {
      const user: UserInfo = {
        id: '1',
        role: 'user',
        subscription: null,
      };
      const token = await jwtService.generateToken({ user, type: 'access' });
      const request = {
        headers: { authorization: `Bearer ${token}` },
      };

      await expect(
        guard.canActivate(host(httpContext(request))),
      ).resolves.toBeTruthy();
    });
  });
  describe('canActive without token', () => {
    let guard: CanActivate;
    let jwtService: JwtService;
    const cookieName = 'test';

    beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          JwtModule.forRoot({
            accessTokenSecret: 'access',
            refreshTokenSecret: 'refresh',
            expiresAccessToken: '24d',
            expiresRefreshToken: '24d',
            authCookieName: cookieName,
          }),
        ],
        providers: [
          {
            provide: 'guard',
            useClass: AuthGuard({
              roles: ['user', 'admin'],
              subscription: true,
            }),
          },
        ],
      }).compile();
      guard = module.get<CanActivate>('guard');
      jwtService = module.get<JwtService>(JWT_TOKEN);
    });

    it('guard should be defined', () => {
      expect(guard).toBeDefined();
    });
    it('jwt service should be defined', () => {
      expect(jwtService).toBeDefined();
    });

    it('empty header => error', async () => {
      await expect(guard.canActivate(host(httpContext({})))).rejects.toThrow(
        UnauthorizedException,
      );
    });
    it('bad exist header => error', async () => {
      const request = {
        headers: { authorization: `Bearer test` },
      };
      await expect(
        guard.canActivate(host(httpContext(request))),
      ).rejects.toThrow(UnauthorizedException);
    });
    it('bad not exist header  => error', async () => {
      const request = {
        headers: { authorization: undefined },
      };
      await expect(
        guard.canActivate(host(httpContext(request))),
      ).rejects.toThrow(UnauthorizedException);
    });
    it('empty header but has cookie => success', async () => {
      const user: UserInfo = {
        id: '1',
        role: 'user',
        subscription: new Date(Date.now() + 1000 * 60 * 60 * 24),
      };
      const token = await jwtService.generateToken({ user, type: 'access' });
      const request = {
        cookies: { [cookieName]: token },
      };

      await expect(
        guard.canActivate(host(httpContext(request))),
      ).resolves.toBeTruthy();
    });
  });
});
