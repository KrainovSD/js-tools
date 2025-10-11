import { Inject } from '@nestjs/common';

import { S3_INSTANCE_TOKEN, S3_OPTIONS_TOKEN, S3_TOKEN } from './s3.constants';

export const InjectS3Instance = () => Inject(S3_INSTANCE_TOKEN);
export const InjectS3Options = () => Inject(S3_OPTIONS_TOKEN);
export const InjectS3 = () => Inject(S3_TOKEN);
