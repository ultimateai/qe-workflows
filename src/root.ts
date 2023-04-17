// This allows TypeScript to detect our global value
// We need to add this in order for Sentry to work as expected
// This is described in the official documentation: https://docs.sentry.io/platforms/node/typescript/
declare global {
    namespace NodeJS {
        interface Global {
            __rootdir__: string;
        }
    }
}

global.__rootdir__ = __dirname || process.cwd();

export {};
