import { API_MIDDLEWARES, IS_BROWSER, IS_JEST } from "../../../constants";
import type {
  ActiveMiddleware,
  Middleware,
  MiddlewaresOptions,
  RequestInterface,
} from "../../../types";
import { generateAuthMiddleWare } from "./auth-middleware";
import { consoleMiddleware } from "./console-middleware";

export function generateMiddlewares(
  activeMiddlewares: ActiveMiddleware,
  middlewareOptions: MiddlewaresOptions,
) {
  const selectedMiddlewares: Middleware[] = [];

  for (const key of activeMiddlewares) {
    switch (key) {
      case API_MIDDLEWARES.Auth: {
        if (middlewareOptions.auth && (IS_BROWSER || IS_JEST))
          selectedMiddlewares.push(generateAuthMiddleWare(middlewareOptions.auth));
        continue;
      }
      case API_MIDDLEWARES.Logger: {
        selectedMiddlewares.push(consoleMiddleware);
        continue;
      }
      default: {
        continue;
      }
    }
  }

  return function executeMiddlewares<T, Incoming, Body, Outcoming>(
    request: RequestInterface<T, Incoming, Body, Outcoming>,
  ) {
    return new Promise((resolve) => {
      void (async () => {
        for (const middleware of selectedMiddlewares) {
          // eslint-disable-next-line no-await-in-loop
          await middleware(request);
        }

        resolve(1);
      })();
    });
  };
}
