import { LoggerModuleOptions } from '../../logger.interfaces';

export const config: LoggerModuleOptions = {
  defaultMeta: {},
  transportOptions: [
    { type: 'console', level: 'error', format: 'json' },
    {
      type: 'file',
      level: 'debug',
      format: 'json',
      dirName: 'test',
      fileName: 'test-log.txt',
    },
  ],
};
