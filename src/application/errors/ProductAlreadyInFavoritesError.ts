export class ProductAlreadyInFavoritesError extends Error {
    constructor() {
        super('Product already in favorites.');
        this.name = 'ProductAlreadyInFavoritesError';
    }
}
