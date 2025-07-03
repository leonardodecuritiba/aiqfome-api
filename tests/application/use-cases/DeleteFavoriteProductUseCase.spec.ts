import { DeleteFavoriteProductUseCase } from './../../../src/application/use-cases/DeleteFavoriteProductUseCase';
import { AddFavoriteProductUseCase } from '../../../src/application/use-cases/AddFavoriteProductUseCase';
import { IProductService } from '../../../src/application/services/IProductService';
import { ProductNotFoundError } from '../../../src/application/errors/ProductNotFoundError';
import { Product } from '../../../src/domain/entities/product.entity';
import { Client } from '../../../src/domain/entities/client.entity';
import { InMemoryClientRepository } from '../../../src/infrastructure/database/in-memory/InMemoryClientRepository';

class FakeProductService implements IProductService {
    public products: Product[] = [];
    async findProductById(id: number): Promise<Product | null> {
        return this.products.find((p) => p.id === id) || null;
    }
}

describe('DeleteFavoriteProductUseCase', () => {
    let clientRepository: InMemoryClientRepository;
    let productService: FakeProductService;
    let addFavoriteProductUseCase: AddFavoriteProductUseCase;
    let deleteFavoriteProductUseCase: DeleteFavoriteProductUseCase;
    let client: Client;
    const products: Product[] = [
        {
            id: 1,
            title: 'Fake Product',
            price: 100,
            image: 'url1',
            rating: { rate: 4.5, count: 10 },
        },
        { id: 2, title: 'Fake Product 2', price: 50, image: 'url2' },
        {
            id: 3,
            title: 'Fake Product 3',
            price: 10,
            image: 'url3',
            rating: { rate: 3, count: 5 },
        },
    ];

    beforeEach(async () => {
        clientRepository = new InMemoryClientRepository();
        productService = new FakeProductService();
        addFavoriteProductUseCase = new AddFavoriteProductUseCase(clientRepository, productService);
        deleteFavoriteProductUseCase = new DeleteFavoriteProductUseCase(
            clientRepository,
            productService,
        );
        client = new Client({ name: 'Test User', email: 'test@user.com' });
        await clientRepository.create(client);
        productService.products = products;
    });

    it('should remove a favorite product from client', async () => {
        const updatedClient = await addFavoriteProductUseCase.execute({
            clientId: client.id,
            productId: products[0].id,
        });

        expect(updatedClient.favorites).toHaveLength(1);
        expect(updatedClient.favorites[0].id).toBe(products[0].id);

        await deleteFavoriteProductUseCase.execute({
            clientId: client.id,
            productId: products[0].id,
        });

        expect(updatedClient.favorites).toHaveLength(0);
    });

    it('should throw ProductNotFoundError if favorite does not exist', async () => {
        const updatedClient = await addFavoriteProductUseCase.execute({
            clientId: client.id,
            productId: products[0].id,
        });

        expect(updatedClient.favorites).toHaveLength(1);
        expect(updatedClient.favorites[0].id).toBe(products[0].id);

        await expect(
            deleteFavoriteProductUseCase.execute({
                clientId: client.id,
                productId: products[1].id,
            }),
        ).rejects.toThrow(ProductNotFoundError);
    });
});
