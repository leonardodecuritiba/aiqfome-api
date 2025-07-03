import { ServerResponse } from 'http';
import { ZodError } from 'zod';
import { EmailAlreadyExistsError } from '../../application/errors/EmailAlreadyExistsError';
import { UnauthorizedError } from '../../application/errors/UnauthorizedError';
import { ProductAlreadyInFavoritesError } from '../../application/errors/ProductAlreadyInFavoritesError';
import { ClientNotFoundError } from '../../application/errors/ClientNotFoundError';
import { ProductNotFoundError } from '../../application/errors/ProductNotFoundError';
import { ForbiddenError } from '../../application/errors/ForbiddenError';

export const errorHandler = (res: ServerResponse, error: unknown) => {
    if (error instanceof ZodError) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(
            JSON.stringify({
                message: 'Invalid input data',
                errors: error.flatten().fieldErrors,
            }),
        );
        return;
    }

    if (
        error instanceof EmailAlreadyExistsError ||
        error instanceof ProductAlreadyInFavoritesError
    ) {
        res.writeHead(error.statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
        return;
    }

    if (error instanceof ClientNotFoundError || error instanceof ProductNotFoundError) {
        res.writeHead(error.statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
        return;
    }

    if (error instanceof UnauthorizedError) {
        res.writeHead(error.statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
        return;
    }

    if (error instanceof ForbiddenError) {
        res.writeHead(error.statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
        return;
    }

    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
    return;
};
