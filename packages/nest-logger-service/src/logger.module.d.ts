import { DynamicModule } from '@nestjs/common';
import { TransportOption } from './typings';
export type LoggerModuleOptions = {
    transportOptions: TransportOption[];
    defaultMeta?: Record<string, string | undefined>;
};
export declare class LoggerModule {
    static forRoot(options: LoggerModuleOptions): DynamicModule;
}
