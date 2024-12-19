/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/ban-ts-comment */

export const IS_JEST = typeof process != "undefined" && process.env.JEST_WORKER_ID !== undefined;

export const IS_BUN =
  typeof process !== "undefined" && process.versions != null && process.versions.bun != null;

export const IS_DENO = // @ts-expect-error
  typeof Deno !== "undefined" &&
  // @ts-expect-error
  typeof Deno.version !== "undefined" &&
  // @ts-expect-error
  typeof Deno.version.deno !== "undefined";

export const IS_NODE =
  typeof process !== "undefined" && process.versions != null && process.versions.node != null;

export const IS_WEB_WORKER =
  typeof self === "object" &&
  self.constructor &&
  self.constructor.name === "DedicatedWorkerGlobalScope";

export const IS_BROWSER = typeof window !== "undefined" && typeof window.document !== "undefined";
