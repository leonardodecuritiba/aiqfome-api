export class EmailAlreadyExistsError extends Error {
    constructor() {
        super('The provided email already exists.');
        this.name = 'EmailAlreadyExistsError';
    }
}
