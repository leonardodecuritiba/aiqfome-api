import { IClientRepository } from '../../domain/repositories/IClientRepository';
import { IProductService } from '../services/IProductService';
import { ClientNotFoundError } from '../errors/ClientNotFoundError';
import { ProductNotFoundError } from '../errors/ProductNotFoundError';
import { Client } from '../../domain/entities/client.entity';

interface AddFavoriteProductRequest {
    clientId: string;
    productId: number;
}

export class AddFavoriteProductUseCase {
    constructor(
        private clientRepository: IClientRepository,
        private productService: IProductService,
    ) {}

    async execute({ clientId, productId }: AddFavoriteProductRequest): Promise<Client> {
        const client = await this.clientRepository.findById(clientId);
        if (!client) {
            throw new ClientNotFoundError();
        }

        const product = await this.productService.findProductById(productId);
        if (!product) {
            throw new ProductNotFoundError();
        }

        client.addFavorite(product);

        await this.clientRepository.update(client);

        return client;
    }
}
