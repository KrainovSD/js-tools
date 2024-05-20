export const LOGGER_TOKEN = Symbol('krainov-logger');

export const TRANSPORT_TYPES = {
  file: 'file',
  console: 'console',
} as const;
export const TRANSPORT_FORMATS = {
  logfmt: 'logfmt',
  json: 'json',
} as const;
