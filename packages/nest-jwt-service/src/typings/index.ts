export {};

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
