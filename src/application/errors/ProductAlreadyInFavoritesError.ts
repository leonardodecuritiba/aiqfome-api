export class ProductAlreadyInFavoritesError extends Error {
    statusCode: number;
    constructor() {
        super('Product already in favorites.');
        this.name = 'ProductAlreadyInFavoritesError';
        this.statusCode = 409;
    }
}
