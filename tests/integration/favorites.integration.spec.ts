import request from 'supertest';
import { router } from '../../src/presentation/routes';
import { clientRepository, productService } from '../../src/presentation/container';
import { InMemoryClientRepository } from '../../src/infrastructure/database/in-memory/InMemoryClientRepository';
import { Client } from '../../src/domain/entities/client.entity';
import { Product } from '../../src/domain/entities/product.entity';

describe('Favorites Routes Integration', () => {
    let client: Client;
    let apiKey: string;

    beforeEach(async () => {
        if (clientRepository instanceof InMemoryClientRepository) {
            await clientRepository.clear();
        }
        const clientData = { name: 'Favorite Tester', email: 'fav.tester@example.com' };
        const res = await request(router).post('/clients').send(clientData);
        client = res.body;
        apiKey = res.body.apiKey;
        jest.restoreAllMocks();
    });

    it('POST /favorites/{productId} should add a product to favorites with a valid API Key', async () => {
        const productId = 1;
        const mockedProduct: Product = {
            id: productId,
            title: 'Test Product',
            price: 9.99,
            image: 'test.jpg',
        };
        jest.spyOn(productService, 'findProductById').mockResolvedValue(mockedProduct);

        const response = await request(router)
            .post(`/favorites/${productId}`)
            .set('x-api-key', apiKey);

        expect(response.status).toBe(200);
        expect(response.body.favorites).toHaveLength(1);
        expect(response.body.favorites[0].id).toBe(productId);
        expect(response.body.favorites[0].title).toBe(mockedProduct.title);
    });

    it('POST /favorites/{productId} should return 401 if API Key is missing', async () => {
        const productId = 2;

        const response = await request(router).post(`/favorites/${productId}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toContain('API Key is missing');
    });

    it('POST /favorites/{productId} should return 401 if API Key is invalid', async () => {
        const productId = 3;

        const response = await request(router)
            .post(`/favorites/${productId}`)
            .set('x-api-key', 'invalid-api-key');

        expect(response.status).toBe(401);
        expect(response.body.message).toContain('Invalid API Key');
    });

    it('POST /favorites/{productId} should return 404 if product does not exist', async () => {
        const nonExistentProductId = 9999;
        jest.spyOn(productService, 'findProductById').mockResolvedValue(null);

        const response = await request(router)
            .post(`/favorites/${nonExistentProductId}`)
            .set('x-api-key', apiKey);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Product not found.');
    });
});
