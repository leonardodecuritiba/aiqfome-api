export class ForbiddenError extends Error {
    statusCode: number;
    constructor(
        message: string = 'Authorization failed: User is not allowed to perform this action.',
    ) {
        super(message);
        this.name = 'ForbiddenError';
        this.statusCode = 403;
    }
}
