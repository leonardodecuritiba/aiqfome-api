export class UnauthorizedError extends Error {
    statusCode: number;
    constructor(message: string = 'Authentication failed: Invalid or missing API Key.') {
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = 401;
    }
}
