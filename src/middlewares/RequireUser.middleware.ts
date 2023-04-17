import { NextFunction, Response, Request } from 'express';

// used to validate if a user is present
function requireUserMiddleware(req: Request, res: Response, next: NextFunction): void {
    if (!req.user) {
        res.status(401).send('User not authorized');
        return;
    }
    next();
}

export default requireUserMiddleware;
