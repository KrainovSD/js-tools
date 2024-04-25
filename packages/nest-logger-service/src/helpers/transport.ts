import { format } from 'winston';
import { logfmtGetter } from './logfmtGetter';

export const transportFormatLogfmt = format.printf(
  ({ level, message, ...rest }) =>
    logfmtGetter({
      level,
      time: new Date().toISOString(),
      ...rest,
      message,
    }),
);
export const transportFormatJson = format.printf(
  ({ level, message, ...rest }) =>
    JSON.stringify({
      level,
      time: new Date().toISOString(),
      ...rest,
      message,
    }),
);
