import { AddFavoriteProductUseCase } from './../../../src/application/use-cases/AddFavoriteProductUseCase';
import { IClientRepository } from '../../../src/domain/repositories/IClientRepository';
import { IProductService } from '../../../src/application/services/IProductService';
import { ClientNotFoundError } from '../../../src/application/errors/ClientNotFoundError';
import { ProductNotFoundError } from '../../../src/application/errors/ProductNotFoundError';
import { ProductAlreadyInFavoritesError } from '../../../src/application/errors/ProductAlreadyInFavoritesError';
import { Product } from '../../../src/domain/entities/product.entity';
import { Client } from '../../../src/domain/entities/client.entity';

// Fakes (Test Doubles)
class InMemoryClientRepository implements IClientRepository {
    public clients: Client[] = [];
    async create(client: Client): Promise<Client> {
        this.clients.push(client);
        return client;
    }
    async findByEmail(email: string): Promise<Client | null> {
        return this.clients.find((c) => c.email === email) || null;
    }
    async findById(id: string): Promise<Client | null> {
        return this.clients.find((c) => c.id === id) || null;
    }
    async findByApiKey(apiKey: string): Promise<Client | null> {
        return this.clients.find((c) => c.apiKey === apiKey) || null;
    }
    async remove(id: string): Promise<boolean> {
        const index = this.clients.findIndex((c) => c.id === id);
        if (index !== -1) {
            this.clients.splice(index, 1);
            return true;
        }
        return false;
    }
    async update(client: Client): Promise<Client> {
        const index = this.clients.findIndex((c) => c.id === client.id);
        if (index !== -1) this.clients[index] = client;
        return client;
    }
}

class FakeProductService implements IProductService {
    public products: Product[] = [];
    async findProductById(id: number): Promise<Product | null> {
        return this.products.find((p) => p.id === id) || null;
    }
}

describe('AddFavoriteProductUseCase', () => {
    let clientRepository: InMemoryClientRepository;
    let productService: FakeProductService;
    let addFavoriteProductUseCase: AddFavoriteProductUseCase;
    let client: Client;
    const product: Product = { id: 1, title: 'Fake Product', price: 100, image: 'url' };

    beforeEach(async () => {
        clientRepository = new InMemoryClientRepository();
        productService = new FakeProductService();
        addFavoriteProductUseCase = new AddFavoriteProductUseCase(clientRepository, productService);
        client = new Client({ name: 'Test User', email: 'test@user.com' });
        await clientRepository.create(client);
        productService.products.push(product);
    });

    it('should add a favorite product to a client', async () => {
        const updatedClient = await addFavoriteProductUseCase.execute({
            clientId: client.id,
            productId: product.id,
        });

        expect(updatedClient.favorites).toHaveLength(1);
        expect(updatedClient.favorites[0].id).toBe(product.id);
    });

    it('should throw ClientNotFoundError if client does not exist', async () => {
        await expect(
            addFavoriteProductUseCase.execute({
                clientId: 'non-existent-id',
                productId: product.id,
            }),
        ).rejects.toThrow(ClientNotFoundError);
    });

    it('should throw ProductNotFoundError if product does not exist', async () => {
        await expect(
            addFavoriteProductUseCase.execute({
                clientId: client.id,
                productId: 999,
            }),
        ).rejects.toThrow(ProductNotFoundError);
    });

    it('should throw ProductAlreadyInFavoritesError if product is already a favorite', async () => {
        await addFavoriteProductUseCase.execute({
            clientId: client.id,
            productId: product.id,
        });

        await expect(
            addFavoriteProductUseCase.execute({
                clientId: client.id,
                productId: product.id,
            }),
        ).rejects.toThrow(ProductAlreadyInFavoritesError);
    });
});
