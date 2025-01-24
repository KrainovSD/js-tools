import { isNumber, isObject, isString } from "@krainovsd/js-helpers";
import build from "pino-abstract-transport";
import { getCorrectLog } from "./lib";

type Options = {
  deniedProperties?: string[];
} & Record<string, unknown>;

export default function transport(opts: Options = {}) {
  const deniedProperty = opts.deniedProperties?.map((property) => {
    return String(property).trim().toLowerCase();
  });

  return build(async function build(source) {
    for await (const obj of source) {
      if (!isObject(obj)) return;

      obj.time = new Date().toISOString();
      if (isString(obj.level) || isNumber(obj.level)) obj.level = getPinoLevel(obj.level);
      getCorrectLog(obj, deniedProperty);
    }
  });
}

function getPinoLevel(level: number | string) {
  switch (String(level).toLowerCase()) {
    case "30": {
      return "info";
    }
    case "40": {
      return "warn";
    }
    case "50": {
      return "error";
    }
    default: {
      return "debug";
    }
  }
}
