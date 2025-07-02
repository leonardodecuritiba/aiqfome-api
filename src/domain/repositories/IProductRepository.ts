import { Product } from '../entities/product.entity';

export interface IProductRepository {
    getAll(): Promise<Product[]>;
    findById(id: string): Promise<Product | null>;
}
