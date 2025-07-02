import { randomUUID } from 'crypto';
import { Product } from './product.entity';
import { ProductAlreadyInFavoritesError } from '../../application/errors/ProductAlreadyInFavoritesError';

interface ClientProps {
    id?: string;
    name: string;
    email: string;
    favorites?: Product[];
    apiKey?: string;
}

export class Client {
    public readonly id: string;
    public name: string;
    public email: string;
    public readonly apiKey: string;
    public favorites: Product[];

    constructor(props: ClientProps) {
        this.id = props.id || randomUUID();
        this.apiKey = props.apiKey || randomUUID();
        this.name = props.name;
        this.email = props.email;
        this.favorites = props.favorites || [];

        this.validate();
    }

    private validate() {
        if (!this.name) {
            throw new Error('Client name is required');
        }
        if (!this.email) {
            throw new Error('Client email is required');
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
            throw new Error('Invalid email format');
        }
    }

    addFavorite(product: Product) {
        if (this.favorites.some((fav) => fav.id === product.id)) {
            throw new ProductAlreadyInFavoritesError();
        }
        this.favorites.push(product);
    }
}
