import { ValueOf } from '@krainovsd/utils';
import { LogLevel } from '@nestjs/common';
import { TRANSPORT_FORMATS, TRANSPORT_TYPES } from '../logger.constants';
export type TransportType = ValueOf<typeof TRANSPORT_TYPES>;
export type TransportFormat = ValueOf<typeof TRANSPORT_FORMATS>;
export type TransportOption = TransportFileOption | TransportConsoleOption;
export type TransportFileOption = {
    type: typeof TRANSPORT_TYPES.file;
    dirName: string;
    fileName: string;
    level: LogLevel;
    format: TransportFormat;
};
export type TransportConsoleOption = {
    type: typeof TRANSPORT_TYPES.console;
    level: LogLevel;
    format: TransportFormat;
};
