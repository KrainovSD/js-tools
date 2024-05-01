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
    incomingFileName?: string;
    traceId?: string;
    operationId?: string;
    user?: UserInfo;
  }
}
