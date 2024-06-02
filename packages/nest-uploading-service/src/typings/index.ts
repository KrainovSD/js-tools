export {};

declare global {
  interface IncomingFile {
    name: string;
    payload: Buffer;
  }

  namespace Storage {
    interface MultipartFile {
      toBuffer: () => Promise<Buffer>;
      file: NodeJS.ReadableStream;
      fieldname: string;
      filename: string;
      encoding: string;
      mimetype: string;
      fields: import('@fastify/multipart').MultipartFields;
    }
  }
  interface UserInfo {
    id: string;
    role: string;
    subscription: Date | null;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    incomingFile?: IncomingFile;
    operationId?: string;
    user?: UserInfo;
  }
}
