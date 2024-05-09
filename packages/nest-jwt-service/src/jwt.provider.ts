import { Provider } from '@nestjs/common';
import { JWT_PROVIDER_MODULE } from './jwt.constants';
import { JwtService } from './jwt.service';

export function createProvider(): Provider {
  return {
    provide: JWT_PROVIDER_MODULE,
    useClass: JwtService,
  };
}
