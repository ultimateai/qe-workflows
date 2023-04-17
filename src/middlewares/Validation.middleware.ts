import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import HttpError from '../errors/HttpError';

// automated validation of body params based on DTO class
function validationMiddleware(type: any, skipMissingProperties = false): RequestHandler {
    return async (req, res, next): Promise<void> => {
        const errors = await validate(plainToInstance(type, req.body), { skipMissingProperties });
        if (errors.length > 0) {
            const messages = errors.map((error: ValidationError) => {
                const message = error.toString();
                // remove first line of validation errors to hide DTO name
                const lines = message.split('\n');
                lines.shift();
                return lines.join('\n');
            });
            next(new HttpError(400, messages.join('\n')));
        } else {
            next();
        }
    };
}

export default validationMiddleware;
