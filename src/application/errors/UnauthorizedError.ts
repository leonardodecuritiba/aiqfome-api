export class UnauthorizedError extends Error {
    constructor(message: string = 'Authentication failed: Invalid or missing API Key.') {
        super(message);
        this.name = 'UnauthorizedError';
    }
}
