import * as express from 'express';
import * as Sentry from '@sentry/node';
import * as Integrations from '@sentry/integrations';
import * as Tracing from '@sentry/tracing';
import { SamplingContext } from '@sentry/types';
import { AxiosError } from 'axios';
import { logger } from './Logger.util';
export default class SentryClass {
    static init(app: express.Application): void {
        const ignoredTransactions = ['GET /ready'];

        const isSentryEnabled = !!process.env.SENTRY_ENABLED;
        if (isSentryEnabled) {
            const version = process.env.APP_VERSION;
            const appEnv = process.env.APP_ENV;
            const name = process.env.APP_NAME;
            const sentryKey = process.env.SENTRY_KEY;
            const project = process.env.SENTRY_PROJECT;
            Sentry.init({
                dsn: `https://${sentryKey}@sentry.io/${project}`,
                release: `${name}@${version}`,
                environment: appEnv,
                attachStacktrace: true,
                // eslint-disable-next-line @typescript-eslint/tslint/config
                beforeSend(event) {
                    if (event.user) {
                        // eslint-disable-next-line no-param-reassign
                        delete event.user.email;
                    }
                    return event;
                },
                integrations: [
                    new Integrations.RewriteFrames({
                        root: global.__rootdir__
                    }),
                    new Sentry.Integrations.OnUncaughtException(),
                    new Sentry.Integrations.OnUnhandledRejection(),
                    new Tracing.Integrations.Mongo({ useMongoose: true, describeOperations: false }),
                    new Sentry.Integrations.Http({ tracing: true }),
                    new Tracing.Integrations.Express({
                        app
                    })
                ],
                tracesSampler: (c: SamplingContext) => {
                    if (appEnv !== 'production' || ignoredTransactions.includes(c.transactionContext.name)) {
                        return 0;
                    }
                    return process.env.TRACING_SAMPLE_PERCENTAGE ? +process.env.TRACING_SAMPLE_PERCENTAGE : 0.5;
                }
            });
        }
    }
}

export function sentryError(
    error: Error | AxiosError,
    botId?: string,
    conversationId?: string,
    platformConversationId?: string
): void {
    let errorMessage: string;
    if ('isAxiosError' in error && error.isAxiosError) {
        errorMessage = JSON.stringify(error?.response?.data);
    } else {
        errorMessage = error.message;
    }

    if (botId) {
        errorMessage +=
            ` happened to bot: ${botId} with conversationId: ${conversationId}` +
            ` with platformConversationId: ${platformConversationId}`;
    }

    logger.error(errorMessage, error);

    Sentry.captureException(error, {
        tags: {
            botId,
            conversationId,
            platformConversationId
        }
    });
}
