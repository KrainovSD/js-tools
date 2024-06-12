import { Inject } from '@nestjs/common';

import { JWT_OPTIONS_TOKEN, JWT_TOKEN } from './jwt.constants';

export const InjectJWT = () => Inject(JWT_TOKEN);
export const InjectJWTOptions = () => Inject(JWT_OPTIONS_TOKEN);
