import { IProductService } from '../../application/services/IProductService';
import { Product } from '../../domain/entities/product.entity';

interface FakeStoreProductDTO {
    id: number;
    title: string;
    price: number;
    image: string;
    description: string;
    category: string;
    rating: {
        rate: number;
        count: number;
    };
}

export class FakeStoreProductService implements IProductService {
    private readonly baseUrl = process.env.FAKE_API ?? 'https://fakestoreapi.com';

    async findProductById(id: number): Promise<Product | null> {
        try {
            const response = await fetch(`${this.baseUrl}/products/${id}`);

            if (!response.ok) {
                console.error(`Error fetching product ${id}: ${response.statusText}`);
                return null;
            }

            const content = await response.text();

            if (!content) {
                return null;
            }

            const data = JSON.parse(content) as FakeStoreProductDTO;

            if (!data || !data.id) {
                return null;
            }

            const product: Product = {
                id: data.id,
                title: data.title,
                price: data.price,
                image: data.image,
            };

            return product;
        } catch (error) {
            console.error(`An unexpected error occurred while fetching product ${id}:`, error);
            return null;
        }
    }
}
