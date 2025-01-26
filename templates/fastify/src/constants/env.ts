import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.HOST) {
  throw new Error("HOST not found");
}

if (!process.env.PORT) {
  throw new Error("PORT not found");
}

if (!process.env.SERVICE_NAME) {
  throw new Error("SERVICE_NAME not found");
}

const logLevel = process.env.LOG_LEVEL?.toLowerCase?.();
const logFormat = process.env.LOG_FORMAT?.toLowerCase?.();

export const HOST = process.env.HOST;
export const PORT = process.env.PORT;
export const SERVICE_NAME = process.env.SERVICE_NAME;
export const LOG_LEVEL =
  logLevel === "debug" || logLevel === "info" || logLevel === "warn" || logLevel === "error"
    ? logLevel
    : "info";
export const LOG_FORMAT = logFormat === "logfmt" || logFormat === "json" ? logFormat : "logfmt";
