/* eslint-disable no-console */
import type { LoggerPostMiddlewareOptions, PostMiddleware } from "../../../types";
import { RESPONSE_DATA_SYMBOL } from "../constants";

export function generateConsolePostMiddleware(
  options: LoggerPostMiddlewareOptions = {},
): PostMiddleware {
  return (request, response) => {
    return new Promise((resolve) => {
      void (async function logger() {
        try {
          if (
            !response ||
            (options.filter && !options.filter(response)) ||
            (options.filterStatus && !options.filterStatus(response.status)) ||
            (options.filterUrl && !options.filterUrl(response.url)) ||
            (options.filterHeaders && !options.filterHeaders(response.headers))
          ) {
            resolve(true);

            return;
          }

          const contentType = response.headers.get("content-type");
          let result;
          if (contentType?.includes?.("text")) {
            result = await response.text();
          } else if (contentType?.includes?.("json")) {
            result = await response.json();
          } else {
            result = await response.blob();
          }

          Object.defineProperty(response, RESPONSE_DATA_SYMBOL, {
            value: result,
            writable: false,
            enumerable: false,
            configurable: true,
          });

          console.log({
            url: response.url,
            status: response.status,
            headers: response.headers,
            body: result,
          });

          resolve(true);
        } catch {
          if (response) {
            console.log({ url: response.url, status: response.status, headers: response.headers });
          }

          resolve(true);
        }
      })().finally(() => {
        resolve(true);
      });
    });
  };
}
