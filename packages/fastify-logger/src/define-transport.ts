import type { PinoLoggerOptions } from "fastify/types/logger";
import { join } from "path";
import type { TransportSettings } from "./logger-types";

export function defineTransport(
  settings: TransportSettings & { ext?: string } = {},
): PinoLoggerOptions["transport"] {
  const { ext = ".cjs", ...rest } = settings;

  return {
    target: getTransportPath(ext),
    options: {
      ...rest,
    },
  };
}

function getTransportPath(ext: string) {
  return join(__dirname, `./transport.${ext.replace(/^./, "")}`);
}
