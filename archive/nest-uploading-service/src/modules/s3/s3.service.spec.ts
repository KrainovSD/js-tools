import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@krainovsd/nest-logger-service';
import * as s3Client from '@aws-sdk/client-s3';
import { DynamicModule } from '@nestjs/common';

import { S3Service } from './s3.service';
import { S3Module } from './s3.module';
import { S3ConfigModule, S3ConfigService, s3Config } from '../s3Config';
import { S3_TOKEN } from './s3.constants';

jest.mock('@aws-sdk/client-s3');

const s3Mock = {
  success: 's3success',
  error: 's3error',

  headBucket() {
    throw new Error();
  },
  createBucket() {
    return true;
  },
  getObject({ Key }: { Key: string }) {
    switch (Key) {
      case this.success:
        return { Body: 1 };
      case this.error:
        return { Body: null };
      default:
        return false;
    }
  },
  putObject({ Key }: { Key: string }) {
    switch (Key) {
      case this.success:
        return true;
      case this.error:
        throw new Error();
      default:
        return false;
    }
  },
  deleteObject({ Key }: { Key: string }) {
    switch (Key) {
      case this.success:
        return true;
      case this.error:
        throw new Error();
      default:
        return false;
    }
  },
};

describe('s3 Service', () => {
  let Logger: DynamicModule;

  beforeAll(() => {
    Logger = LoggerModule.forRoot({
      transportOptions: [{ type: 'console', format: 'logfmt', level: 'error' }],
    });
    jest
      .spyOn(s3Client, 'S3')
      .mockReturnValue(s3Mock as unknown as s3Client.S3);
  });

  describe('check is defined by all methods', () => {
    it('should be defined sync', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [Logger, S3Module.forRoot(s3Config)],
      }).compile();
      const s3Service = module.get<S3Service>(S3_TOKEN);
      expect(s3Service).toBeDefined();
    });

    it('should be defined async useFactory', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          Logger,
          S3ConfigModule,
          S3Module.forRootAsync({
            useFactory: (config: S3ConfigService) => config.createOptions(),
            inject: [S3ConfigService],
          }),
        ],
      }).compile();
      const s3Service = module.get<S3Service>(S3_TOKEN);
      expect(s3Service).toBeDefined();
    });

    it('should be defined async useExisting', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          Logger,
          S3ConfigModule,
          S3Module.forRootAsync({
            useExisting: S3ConfigService,
          }),
        ],
      }).compile();
      const s3Service = module.get<S3Service>(S3_TOKEN);
      expect(s3Service).toBeDefined();
    });

    it('should be defined async useClass', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          Logger,
          S3Module.forRootAsync({
            useClass: S3ConfigService,
          }),
        ],
      }).compile();
      const s3Service = module.get<S3Service>(S3_TOKEN);
      expect(s3Service).toBeDefined();
    });

    it('should be defined async empty', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [Logger, S3Module.forRootAsync({})],
      }).compile();
      const s3Service = module.get<S3Service>(S3_TOKEN);
      expect(s3Service).toBeDefined();
    });
  });

  describe('methods', () => {
    let s3Service: S3Service;

    beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [Logger, S3Module.forRoot(s3Config)],
      }).compile();
      s3Service = module.get<S3Service>(S3_TOKEN);
    });

    it('getItem success', async () => {
      await expect(
        s3Service.getItem({ key: s3Mock.success }),
      ).resolves.not.toBeNull();
    });
    it('getItem error', async () => {
      await expect(
        s3Service.getItem({ key: s3Mock.error }),
      ).resolves.toBeNull();
    });
    it('putItem success', async () => {
      await expect(
        s3Service.putItem({ key: s3Mock.success, payload: Buffer.from([]) }),
      ).resolves.toBeTruthy();
    });
    it('putItem error', async () => {
      await expect(
        s3Service.putItem({ key: s3Mock.error, payload: Buffer.from([]) }),
      ).resolves.toBeFalsy();
    });
    it('deleteItem success', async () => {
      await expect(
        s3Service.deleteItem({ key: s3Mock.success }),
      ).resolves.toBeTruthy();
    });
    it('deleteItem error', async () => {
      await expect(
        s3Service.deleteItem({ key: s3Mock.error }),
      ).resolves.toBeFalsy();
    });
  });

  describe('init s3 client', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should error by create bucket', async () => {
      jest.spyOn(s3Client, 'S3').mockReturnValue({} as unknown as s3Client.S3);

      await expect(
        Test.createTestingModule({
          imports: [
            Logger,
            S3ConfigModule,
            S3Module.forRootAsync({
              useFactory: (config: S3ConfigService) => config.createOptions(),
              inject: [S3ConfigService],
            }),
          ],
        }).compile(),
      ).rejects.toThrow(Error('error create s3 bucket'));
    });

    it('should success by create bucket', async () => {
      jest
        .spyOn(s3Client, 'S3')
        .mockReturnValue({ headBucket: () => true } as unknown as s3Client.S3);

      await expect(
        Test.createTestingModule({
          imports: [
            Logger,
            S3ConfigModule,
            S3Module.forRootAsync({
              useFactory: (config: S3ConfigService) => config.createOptions(),
              inject: [S3ConfigService],
            }),
          ],
        }).compile(),
      ).resolves.not.toBeNull();
    });
  });
});
