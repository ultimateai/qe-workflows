import 'dotenv/config';
import './root';
import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import * as YAML from 'yamljs';
import * as swagger from 'swagger-ui-express';

import * as Sentry from '@sentry/node';
import SentryClass from './utils/Sentry.error';
import createContext from './utils/ContextHelper.util';
import errorMiddleware from './middlewares/Error.middleware';
import handlerStats from './middlewares/HandlerStats.middleware';
import enrichTags from './middlewares/Sentry.middleware';
import Routes from './models/interfaces/Routes.interface';
import { Response } from 'express';
import validateEnv from './utils/validateEnv';
import { config } from 'dotenv';
import { logger } from './utils/Logger.util';
import Request from '../types/Customs';
import { version as appVersion } from '../package.json';

let path = '.env';
if (process.env.NODE_ENV === 'test') {
    path = '.env.test';
}
config({ path });
validateEnv();

class App {
    public app: any;
    public name: string;
    public port: string | number;
    public isProduction: boolean;
    public env: string;
    public version: string;
    public isSentryEnabled: boolean;
    private isTest: boolean;
    private readonly routes: Routes[];

    constructor(routes: Routes[], isTest = false) {
        this.app = express();
        this.name = process.env.APP_NAME || 'app';
        this.port = process.env.PORT || 3000;
        this.isProduction = process.env.APP_ENV === 'production';
        this.env = process.env.APP_ENV || 'local';
        this.version = process.env.APP_VERSION || '0.01';
        this.isSentryEnabled = !!process.env.SENTRY_ENABLED;
        this.isTest = isTest;
        this.routes = routes;
    }

    public getServer(): express.Application {
        return this.app;
    }

    public async initializeApp(): Promise<void> {
        // enable it to connect to mongodb
        // if (!this.isTest) {
        //     await databaseClient.connectToDatabase();
        // }
        SentryClass.init(this.app);
        this.initializeMiddlewares();
        this.initializeRoutes(this.routes);
        this.initializeErrorHandling();
        this.initializeSwagger();
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            logger.info(`🚀 App listening on port ${this.port}`);
        });
    }

    private initializeSwagger(): void {
        if (process.env.APP_ENV !== 'production') {
            const swaggerDocument = YAML.load('./swagger.yaml');
            this.app.use('/docs', swagger.serve, swagger.setup(swaggerDocument));
        }
    }

    private initializeMiddlewares(): void {
        if (this.isSentryEnabled) {
            // The request handler must be the first middleware on the app
            this.app.use(Sentry.Handlers.requestHandler({ user: false, request: false }));
            // // TracingHandler creates a trace for every incoming request
            this.app.use(Sentry.Handlers.tracingHandler());
        }
        if (this.isProduction) {
            this.app.use(hpp());
            this.app.use(helmet());
        }

        this.app.use(createContext);
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(handlerStats());

        if (this.isSentryEnabled) {
            this.app.use(enrichTags);
        }
    }

    private initializeRoutes(routes: Routes[]): void {
        routes.forEach((route) => {
            this.app.use('/', route.router);
        });
        this.app.use('/ready', (req: Request, res: Response) => {
            res.status(200).send();
        });

        this.app.use('/version', (req: Request, res: Response) => {
            // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
            const version: string = process.env.APP_VERSION || appVersion;
            res.send(`${process.env.APP_ENV}@${version}`);
        });
    }

    private initializeErrorHandling(): void {
        if (this.isSentryEnabled) {
            this.app.use(Sentry.Handlers.errorHandler());
        }
        this.app.use(errorMiddleware);
    }
}

export default App;
