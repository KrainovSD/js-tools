export * from './rpcData';
export * from './transport';
export * from './service';

export interface Client extends Record<string, unknown> {
  user?: UserInfo;
  id?: string;
  operationId?: string;
  traceId?: string;
}

declare global {
  interface UserInfo {
    id: string;
    role: string;
    subscription: Date | null;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    operationId?: string;
    traceId?: string;
    user?: UserInfo;
  }
}
