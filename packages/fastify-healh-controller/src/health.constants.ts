import type { RouteOptions, Schema } from "./health.types";

export const HEALTH_TAGS = ["Health"];
export const SCHEMA: Schema = {
  description: "Check health",
  tags: HEALTH_TAGS,
} as const;
export const DEFAULT_SETTINGS: RouteOptions[] = [
  { path: "/api/healthz", response: { message: "ok" } },
  { path: "/api/ping", response: { message: "pong" } },
];
