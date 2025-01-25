import type { AuthUserRequestOptions, AuthUserUpdateRequestOptions } from "../../../types";
import { isNull, isUndefined } from "../../typings";

export async function updateAuthUser<User extends Record<string, unknown>>(
  options: AuthUserUpdateRequestOptions<User>,
) {
  const userInfo = await (options.userRequest ? options.userRequest() : getAuthUser(options));
  if (isNull(userInfo)) {
    return void window.location.replace(options.authUrl);
  }
  if (isUndefined(userInfo)) {
    return void window.location.replace(options.errorUrl);
  }

  return userInfo;
}

export async function getAuthUser<User extends Record<string, unknown>>(
  options: AuthUserRequestOptions,
): Promise<User | null | undefined> {
  let status = 0;
  try {
    const response = await fetch(options.authUserUrl, {
      method: "GET",
    });
    status = response.status;
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = (await response.json()) as User;

    return result;
  } catch {
    if (status >= 500) return undefined;

    return null;
  }
}
