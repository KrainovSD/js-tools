import type { FastifySchema } from "fastify";
import type { JSONSchema7 } from "json-schema";

export type JsonSchema = JSONSchema7 & {
  properties?: Record<string, JsonSchema> | undefined;
  items?: JsonSchema | JsonSchema[] | undefined;
  allOf?: JsonSchema[] | undefined;
  anyOf?: JsonSchema[] | undefined;
  oneOf?: JsonSchema[] | undefined;
  isFile?: boolean;
};

export type Schema = Omit<FastifySchema, "body" | "params" | "querystring" | "response"> & {
  body?: JsonSchema;
  params?: JsonSchema;
  querystring?: JsonSchema;
  response?: Record<string | number, JsonSchema>;
};
