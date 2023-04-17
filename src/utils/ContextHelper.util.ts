import { NextFunction, Response, Request } from 'express';
import { v4 } from 'uuid';

export default function createContext(req: Request, res: Response, next: NextFunction): void {
    const correlationId: string =
        typeof req.headers['x-correlation-id'] === 'string' ? req.headers['x-correlation-id'] : v4();
    req.context = {
        correlationId
    };
    next();
}
