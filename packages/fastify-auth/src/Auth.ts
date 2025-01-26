import { getByPath, isString } from "@krainovsd/js-helpers";
import type { FastifyRequest } from "fastify";
import type { IncomingHttpHeaders } from "http";
import * as jose from "jose";

type AuthOptions = {
  cookieName?: string;
  usernameField?: string;
  tokenSecret?: string;
  secretType?: "oauth-remote" | "secret";
};

export class Auth<User extends Record<string, unknown>> {
  cookieName: string | undefined;

  usernameField: string | undefined;

  tokenSecret: string | undefined;

  secretType: "oauth-remote" | "secret" | undefined;

  constructor({ cookieName, secretType, tokenSecret, usernameField }: AuthOptions) {
    this.cookieName = cookieName;
    this.tokenSecret = tokenSecret;
    this.secretType = secretType;
    this.usernameField = usernameField;
  }

  async getUserInfo(headers: IncomingHttpHeaders = {}, token: string | null | undefined = null) {
    if (!token) token = this.getToken(headers);
    if (!this.tokenSecret || !token || !this.usernameField) return null;

    try {
      let userInfo: User | undefined;
      switch (this.secretType) {
        case "oauth-remote": {
          const JWKS = jose.createRemoteJWKSet(new URL(this.tokenSecret));
          userInfo = (await jose.jwtVerify<User>(token, JWKS)).payload;
          break;
        }
        case "secret": {
          const secretKey = new TextEncoder().encode(this.tokenSecret);
          userInfo = (await jose.jwtVerify<User>(token, secretKey)).payload;
          break;
        }
        default: {
          break;
        }
      }

      const username = getByPath(userInfo, this.usernameField);
      if (!isString(username)) return null;

      return { username, token };
    } catch {
      return null;
    }
  }

  getToken(headers: FastifyRequest["headers"]) {
    const cookieToken = this.getCookieToken(headers?.cookie);
    if (cookieToken) return cookieToken;
    const headerToken = this.getAuthToken(headers);

    return headerToken;
  }

  private getCookieToken(cookies: string | undefined) {
    if (!cookies || !this.cookieName) return null;
    const cookiesArray = cookies.split(";");
    const token = cookiesArray
      .find((cookie) => {
        return cookie.includes(`${this.cookieName}=`);
      })
      ?.replace(`${this.cookieName}=`, "");

    return token?.trim() ?? null;
  }

  private getAuthToken(headers: Record<string, string | string[] | undefined>) {
    let token: string | undefined;
    if (isString(headers.Authorization)) token = headers.Authorization.replace("Bearer", "").trim();
    if (isString(headers.authorization)) token = headers.authorization.replace("Bearer", "").trim();

    return isString(token) ? token : null;
  }
}
