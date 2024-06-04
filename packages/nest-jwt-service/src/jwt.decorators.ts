import { Inject } from '@nestjs/common';

import { JWT_TOKEN } from './jwt.constants';

export const InjectJWT = () => Inject(JWT_TOKEN);
