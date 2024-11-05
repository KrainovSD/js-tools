import { typings } from "..";
import type { AuthMiddleWareOptions } from "../../types";
import { getByPath } from "../utils";

export const tokenRequest = async (options: Required<AuthMiddleWareOptions>) => {
  try {
    const response = await fetch(options.authTokenUrl, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = (await response.json()) as Record<string, unknown>;

    const { expiresToken, token } = transformData(
      result,
      options.pathToToken,
      options.pathToExpires,
    );

    localStorage.setItem(options.storageExpiresTokenName, expiresToken);
    localStorage.setItem(options.storageTokenName, token);

    return token;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    window.location.replace(options.authRedirectUrl);

    return null;
  }
};

function transformData(data: unknown, pathToToken: string, pathToExpires: string): TokenPayload {
  if (!typings.isObject(data)) throw new Error("Bad response data");

  const token = getByPath(data, pathToToken);
  const expiresToken = getByPath(data, pathToExpires);

  if (
    (!typings.isString(expiresToken) && !typings.isNumber(expiresToken)) ||
    !typings.isString(token)
  )
    throw new Error("Bad response data");

  return {
    expiresToken: String(expiresToken),
    token,
  };
}

type TokenPayload = {
  token: string;
  expiresToken: string;
};
