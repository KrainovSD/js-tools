/* eslint-disable no-console */
import type { Headers as NodeHeaders, Response as NodeResponse } from "node-fetch";
import { RESPONSE_DATA_SYMBOL } from "../api.constants";
import type { AfterHandler } from "../api.types";

export type LoggerAfterHandlerOptions = {
  filter?: (response: Response | NodeResponse | undefined) => boolean;
  filterStatus?: (status: number) => boolean;
  filterUrl?: (url: string) => boolean;
  filterHeaders?: (headers: Headers | NodeHeaders) => boolean;
};

export function loggerAfterHandler(options: LoggerAfterHandlerOptions = {}): AfterHandler {
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
            resolve();

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

          resolve();
        } catch {
          if (response) {
            console.log({ url: response.url, status: response.status, headers: response.headers });
          }

          resolve();
        }
      })().finally(() => {
        resolve();
      });
    });
  };
}
