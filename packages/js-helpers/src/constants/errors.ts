import type { RequestHeader } from "../api";

type ResponseErrorOptions = {
  message: string;
  status: number;
  code?: number;
  description?: unknown;
  headers?: RequestHeader;
};

export class ResponseError extends Error {
  status: number;
  code?: number;
  description?: unknown;
  headers?: RequestHeader;

  constructor({ message, status, description, code, headers }: ResponseErrorOptions) {
    super(message);
    this.status = status;
    this.description = description;
    this.code = code;
    this.headers = headers;
  }
}
