import type { LoggerMiddlewareOptions, Middleware, RequestInterface } from "../../../types";

export function generateConsoleMiddleware(options: LoggerMiddlewareOptions = {}): Middleware {
  return (request) => {
    return new Promise((resolve) => {
      if (
        (options.filter &&
          !options.filter(request as RequestInterface<unknown, unknown, unknown, unknown>)) ||
        (options.filterHeaders && !options.filterHeaders(request.headers)) ||
        (options.filterMethod && !options.filterMethod(request.method)) ||
        (options.filterParams && !options.filterParams(request.params)) ||
        (options.filterPath && !options.filterPath(request.path))
      ) {
        resolve(true);

        return;
      }
      // eslint-disable-next-line no-console
      console.log(request);
      resolve(true);
    });
  };
}
