import type { Middleware } from "../../../types";

export const consoleMiddleware: Middleware = (response) => {
  return new Promise((resolve) => {
    // eslint-disable-next-line no-console
    console.log(response);
    resolve(true);
  });
};
