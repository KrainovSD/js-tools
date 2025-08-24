import type { Response as NodeResponse } from "node-fetch";
import { API_MIDDLEWARES, IS_BROWSER, IS_JEST, POST_API_MIDDLEWARES } from "../../../constants";
import type {
  ActiveMiddleware,
  ActivePostMiddleware,
  Middleware,
  MiddlewaresOptions,
  OauthOptions,
  PostMiddleware,
  PostMiddlewareOptions,
  RequestInterface,
} from "../../../types";
import { generateConsoleMiddleware } from "./console-middleware";
import { generateConsolePostMiddleware } from "./console-post-middleware";
import { generateOauthMiddleware } from "./oauth-middleware";

// eslint-disable-next-line max-params
export function generateMiddlewares(
  activeMiddlewares: ActiveMiddleware,
  middlewareOptions: MiddlewaresOptions,
  oauthOptions: OauthOptions | undefined,
  customMiddlewares: Middleware[],
) {
  const selectedMiddlewares: Middleware[] = customMiddlewares;

  for (const key of activeMiddlewares) {
    switch (key) {
      case API_MIDDLEWARES.Oauth: {
        if (oauthOptions && (IS_BROWSER || IS_JEST))
          selectedMiddlewares.push(generateOauthMiddleware(oauthOptions));
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

  return function executeMiddlewares<
    IncomingApi,
    Incoming = IncomingApi,
    Outcoming = unknown,
    OutcomingApi = Outcoming,
  >(request: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>) {
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

  return function executeMiddlewares<
    IncomingApi,
    Incoming = IncomingApi,
    Outcoming = unknown,
    OutcomingApi = Outcoming,
  >(
    request: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>,
    response: Response | NodeResponse | undefined,
  ) {
    return new Promise((resolve) => {
      void (async () => {
        for (const middleware of selectedMiddlewares) {
          // eslint-disable-next-line no-await-in-loop
          await middleware(request, response);
        }

        resolve(1);
      })();
    });
  };
}
