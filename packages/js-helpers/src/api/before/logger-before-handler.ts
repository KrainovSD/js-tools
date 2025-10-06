import type {
  BeforeHandler,
  RequestHeader,
  RequestInterface,
  RequestMethod,
  RequestQuery,
} from "../api.types";

export type LoggerBeforeHandlerOptions = {
  filter?: (request: RequestInterface<unknown, unknown, unknown, unknown>) => boolean;
  filterPath?: (path: string) => boolean;
  filterMethod?: (method: RequestMethod) => boolean;
  filterParams?: (params?: RequestQuery) => boolean;
  filterHeaders?: (headers?: RequestHeader) => boolean;
};

export function loggerBeforeHandler(options: LoggerBeforeHandlerOptions = {}): BeforeHandler {
  return (request) => {
    return new Promise((resolve) => {
      if (
        (options.filter &&
          !options.filter(request as RequestInterface<unknown, unknown, unknown, unknown>)) ||
        (options.filterHeaders && !options.filterHeaders(request.headers)) ||
        (options.filterMethod && !options.filterMethod(request.method)) ||
        (options.filterParams && !options.filterParams(request.queries)) ||
        (options.filterPath && !options.filterPath(request.path))
      ) {
        resolve();

        return;
      }
      // eslint-disable-next-line no-console
      console.log(request);
      resolve();
    });
  };
}
