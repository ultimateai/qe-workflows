import { AsyncLocalStorage } from 'async_hooks';
import { Logger, ISettingsParam, TLogLevelName } from 'tslog';
import { requestAsyncLocalStorage } from './RequestAsyncLocalStorage.util';

const appName = process.env.APP_ENV;

function getLoggerSettings(asyncLocalStorage: AsyncLocalStorage<{ correlationId: string }>): ISettingsParam {
    let settings: ISettingsParam;
    switch (process.env.APP_ENV) {
        case 'development':
            settings = {
                type: 'json',
                displayDateTime: false,
                colorizePrettyLogs: false,
                name: appName,
                minLevel: (process.env.LOG_LEVEL as TLogLevelName) || 'info',
                jsonInspectOptions: {
                    breakLength: Infinity
                },
                maskValuesOfKeys: ['authentication'],
                maskAnyRegEx: ['Bearer.*'],
                requestId: (): string => {
                    return asyncLocalStorage.getStore()?.correlationId as string;
                }
            };
            break;
        case 'staging':
            settings = {
                type: 'json',
                displayDateTime: false,
                colorizePrettyLogs: false,
                name: appName,
                minLevel: (process.env.LOG_LEVEL as TLogLevelName) || 'info',
                jsonInspectOptions: {
                    breakLength: Infinity
                },
                maskValuesOfKeys: ['authentication'],
                maskAnyRegEx: ['Bearer.*'],
                requestId: (): string => {
                    return asyncLocalStorage.getStore()?.correlationId as string;
                }
            };
            break;
        case 'production':
            settings = {
                type: 'json',
                displayDateTime: false,
                colorizePrettyLogs: false,
                name: appName,
                minLevel: (process.env.LOG_LEVEL as TLogLevelName) || 'info',
                jsonInspectOptions: {
                    breakLength: Infinity
                },
                maskValuesOfKeys: ['authentication'],
                maskAnyRegEx: ['Bearer.*'],
                requestId: (): string => {
                    return asyncLocalStorage.getStore()?.correlationId as string;
                }
            };
            break;
        default:
            settings = {
                type: 'pretty',
                displayDateTime: true,
                colorizePrettyLogs: true,
                name: appName,
                minLevel: (process.env.LOG_LEVEL as TLogLevelName) || 'info',
                maskValuesOfKeys: ['authentication'],
                maskAnyRegEx: ['Bearer.*'],
                requestId: (): string => {
                    return asyncLocalStorage.getStore()?.correlationId as string;
                }
            };
            break;
    }

    return settings;
}

const loggerSettings = getLoggerSettings(requestAsyncLocalStorage);
export const logger = new Logger(loggerSettings);
