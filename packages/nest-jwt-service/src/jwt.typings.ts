export type TokenType = 'refresh' | 'access';

export type DefaultInfo = {
  operationId: string;
  traceId?: string;
};

export type GetUserInfoOptions = {
  header: string;
} & DefaultInfo;

export type GenerateTokenOptions = {
  user: UserInfo;
  type: TokenType;
} & DefaultInfo;

export type VerifyTokenOptions = {
  token: unknown;
  type: TokenType;
} & DefaultInfo;

export type ModuleOptions = {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  swaggerAccountId: string;
  swaggerBasicAuth: string;
  expiresAccessToken: string;
  expiresRefreshToken: string;
};
