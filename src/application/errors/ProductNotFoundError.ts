export class ProductNotFoundError extends Error {
    statusCode: number;
    constructor() {
        super('Product not found.');
        this.name = 'ProductNotFoundError';
        this.statusCode = 404;
    }
}
