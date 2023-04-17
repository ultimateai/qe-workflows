import jwt from 'jsonwebtoken';
import { NextFunction, Response, Request } from 'express';
import PermissionsServiceClient from '../clients/PermissionsService.client';

async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { JWT_SECRET } = process.env;
    try {
        // in 'local' just skip authentication instead of taking risks of commenting out
        if (process.env.AUTH === 'false') {
            return next();
        }

        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization, JWT_SECRET || '');
        }
        if (typeof req.headers.usertoken === 'string') {
            req.user = await new PermissionsServiceClient().getCurrentUser(req.headers.usertoken);
        }
        // user is optional
        next();
    } catch (e) {
        res.status(401).send();
    }
}

export default authMiddleware;
