import { TransportOption } from './typings';

export interface LoggerModuleOptions {
  transportOptions: TransportOption[];
  defaultMeta?: Record<string, string | undefined>;
}
