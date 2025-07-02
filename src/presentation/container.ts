import { InMemoryClientRepository } from '../infrastructure/database/in-memory/InMemoryClientRepository';
import { FakeStoreProductService } from '../infrastructure/services/FakeStoreProductService';

import { CreateClientUseCase } from '../application/use-cases/CreateClientUseCase';
import { AddFavoriteProductUseCase } from '../application/use-cases/AddFavoriteProductUseCase';

export const clientRepository = new InMemoryClientRepository();
export const productService = new FakeStoreProductService();

export const createClientUseCase = new CreateClientUseCase(clientRepository);
export const addFavoriteProductUseCase = new AddFavoriteProductUseCase(
    clientRepository,
    productService,
);
