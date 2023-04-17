import { NextFunction, Response, Request } from 'express';
import * as Sentry from '@sentry/node';
import { logger } from '../utils/Logger.util';

function setTag(req: Request, key: string): void {
    const value = req.params[key] || req.query[key] || req.body[key];
    if (value) {
        Sentry.setTag(key, value);
    }
}

export default function enrichTags(req: Request, res: Response, next: NextFunction): void {
    try {
        setTag(req, 'botId');
    } catch (e) {
        logger.error('Failed to extract sentry tags');
    } finally {
        next();
    }
}
