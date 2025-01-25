import type { AuthMiddleWareOptions, AuthTokenRequestOptions } from "../../../types";
import { isNull, isNumber, isObject, isString, isUndefined } from "../../typings";
import { getByPath } from "../../utils";

export async function updateAuthToken(options: AuthMiddleWareOptions) {
  let token: string | null | undefined = localStorage.getItem(options.storageTokenName);
  const expires: string | null | undefined = localStorage.getItem(options.storageTokenExpiresName);

  if (!token || !expires || Date.now() > +expires) {
    token = await (options.tokenRequest ? options.tokenRequest() : getAuthToken(options));
    if (isNull(token)) {
      return void window.location.replace(options.authUrl);
    }
    if (isUndefined(token)) {
      return void window.location.replace(options.errorUrl);
    }
  }

  return token;
}

export async function getAuthToken(options: AuthTokenRequestOptions) {
  let status = 0;
  try {
    const response = await fetch(options.authTokenUrl, {
      method: "GET",
    });
    status = response.status;
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = (await response.json()) as Record<string, unknown>;

    try {
      const { expires, token } = transformData(
        result,
        options.pathToToken,
        options.pathToTokenExpires,
      );

      localStorage.setItem(options.storageTokenExpiresName, expires);
      localStorage.setItem(options.storageTokenName, token);

      return token;
    } catch {
      return undefined;
    }
  } catch {
    if (status >= 500) return undefined;

    return null;
  }
}

function transformData(data: unknown, pathToToken: string, pathToTokenExpires: string) {
  if (!isObject(data)) throw new Error("Bad response data");

  const token = getByPath(data, pathToToken);
  const expiresToken = getByPath(data, pathToTokenExpires);

  if ((!isString(expiresToken) && !isNumber(expiresToken)) || !isString(token))
    throw new Error("Bad response data");

  return {
    expires: String(expiresToken),
    token,
  };
}
