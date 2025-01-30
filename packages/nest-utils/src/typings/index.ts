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
    operationId?: string;
    user?: UserInfo;
  }
}
