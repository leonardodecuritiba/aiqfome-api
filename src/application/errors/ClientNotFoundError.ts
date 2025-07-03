export class ClientNotFoundError extends Error {
    statusCode: number;
    constructor() {
        super('Client not found.');
        this.name = 'ClientNotFoundError';
        this.statusCode = 404;
    }
}
