export class EmailAlreadyExistsError extends Error {
    statusCode: number;
    constructor() {
        super('The provided email already exists.');
        this.name = 'EmailAlreadyExistsError';
        this.statusCode = 409;
    }
}
