import type { Response as NodeResponse } from "node-fetch";
import { API_MIDDLEWARES, IS_BROWSER, IS_JEST, POST_API_MIDDLEWARES } from "../../../constants";
import type {
  ActiveMiddleware,
  ActivePostMiddleware,
  Middleware,
  MiddlewaresOptions,
  PostMiddleware,
  PostMiddlewareOptions,
  RequestInterface,
} from "../../../types";
import { generateAuthMiddleWare } from "./auth-middleware";
import { generateConsoleMiddleware } from "./console-middleware";
import { generateConsolePostMiddleware } from "./console-post-middleware";

export function generateMiddlewares(
  activeMiddlewares: ActiveMiddleware,
  middlewareOptions: MiddlewaresOptions,
  customMiddlewares: Middleware[],
) {
  const selectedMiddlewares: Middleware[] = customMiddlewares;

  for (const key of activeMiddlewares) {
    switch (key) {
      case API_MIDDLEWARES.Auth: {
        if (middlewareOptions.auth && (IS_BROWSER || IS_JEST))
          selectedMiddlewares.push(generateAuthMiddleWare(middlewareOptions.auth));
        continue;
      }
      case API_MIDDLEWARES.Logger: {
        selectedMiddlewares.push(generateConsoleMiddleware(middlewareOptions.logger));
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

export function generatePostMiddlewares(
  activePostMiddlewares: ActivePostMiddleware,
  postMiddlewaresOptions: PostMiddlewareOptions,
  customPostMiddlewares: PostMiddleware[],
) {
  const selectedMiddlewares: PostMiddleware[] = customPostMiddlewares;

  for (const key of activePostMiddlewares) {
    switch (key) {
      case POST_API_MIDDLEWARES.Logger: {
        selectedMiddlewares.push(generateConsolePostMiddleware(postMiddlewaresOptions.logger));
        continue;
      }

      default: {
        continue;
      }
    }
  }

  return function executeMiddlewares(response: Response | NodeResponse | undefined) {
    return new Promise((resolve) => {
      void (async () => {
        for (const middleware of selectedMiddlewares) {
          // eslint-disable-next-line no-await-in-loop
          await middleware(response);
        }

        resolve(1);
      })();
    });
  };
}
