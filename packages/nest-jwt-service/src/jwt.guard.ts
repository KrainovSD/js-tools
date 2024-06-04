import { FastifyRequest } from 'fastify';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Inject,
  Type,
  UnauthorizedException,
  mixin,
} from '@nestjs/common';
import { typings } from '@krainovsd/utils';
import { v4 } from 'uuid';

import { JwtService } from './jwt.service';
import { JWT_TOKEN } from './jwt.constants';

type AuthGuardOptions = {
  roles?: string[] | string;
  subscription?: boolean;
};

export function AuthGuard(options?: AuthGuardOptions) {
  class AuthGuardClass implements CanActivate {
    constructor(@Inject(JWT_TOKEN) private readonly jwtService: JwtService) {}

    private checkRole(requiredRoles: string | string[], currentRole: string) {
      if (typings.isArray(requiredRoles)) {
        return requiredRoles.length === 0
          ? true
          : requiredRoles.some((role) => role === currentRole);
      }
      return typings.isString(requiredRoles) && requiredRoles.length > 0
        ? requiredRoles === currentRole
        : true;
    }

    private checkSubscription(subscription: Date | null) {
      if (!subscription) return false;
      const now = new Date();
      return subscription > now;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const requiredRoles = options?.roles;
      const isRequiredSub = options?.subscription;

      const req = context.switchToHttp().getRequest<FastifyRequest>();

      if (!req.operationId) {
        req.operationId = v4();
      }

      try {
        const authHeader = req.headers.authorization;
        if (!authHeader || typeof authHeader !== 'string') throw new Error();

        const user = await this.jwtService.getUserInfo({
          header: authHeader,
        });
        if (!user) throw new Error();

        if (requiredRoles && !this.checkRole(requiredRoles, user.role)) {
          throw new ForbiddenException();
        }
        if (isRequiredSub && !this.checkSubscription(user.subscription)) {
          throw new ForbiddenException();
        }

        req.user = user;
        return true;
      } catch (e: unknown) {
        const error = e as HttpException;
        const status = error?.getStatus?.();
        if (status === 403) {
          throw new ForbiddenException();
        }
        throw new UnauthorizedException();
      }
    }
  }
  const Guard = mixin(AuthGuardClass);
  return Guard as Type<CanActivate>;
}
