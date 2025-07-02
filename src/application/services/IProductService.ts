import { Product } from '../../domain/entities/product.entity';

export interface IProductService {
    findProductById(id: number): Promise<Product | null>;
}
