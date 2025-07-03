import { UpdateClientUseCase } from './../application/use-cases/UpdateClientUseCase';
import { InMemoryClientRepository } from '../infrastructure/database/in-memory/InMemoryClientRepository';
import { FakeStoreProductService } from '../infrastructure/services/FakeStoreProductService';

import { CreateClientUseCase } from '../application/use-cases/CreateClientUseCase';
import { AddFavoriteProductUseCase } from '../application/use-cases/AddFavoriteProductUseCase';
import { ShowClientUseCase } from '../application/use-cases/ShowClientUseCase';
import { DeleteClientUseCase } from '../application/use-cases/DeleteClientUseCase';
import { DeleteFavoriteProductUseCase } from '../application/use-cases/DeleteFavoriteProductUseCase';
import { PostgresClientRepository } from '../infrastructure/database/postgres/PostgresClientRepository';
import { IClientRepository } from '../domain/repositories/IClientRepository';

let clientRepository: IClientRepository;
console.log('NODE_ENV:', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    clientRepository = new InMemoryClientRepository();
} else {
    clientRepository = new PostgresClientRepository();
}
export { clientRepository };
export const productService = new FakeStoreProductService();

export const createClientUseCase = new CreateClientUseCase(clientRepository);
export const addFavoriteProductUseCase = new AddFavoriteProductUseCase(
    clientRepository,
    productService,
);
export const deleteFavoriteProductUseCase = new DeleteFavoriteProductUseCase(
    clientRepository,
    productService,
);

export const updateClientUseCase = new UpdateClientUseCase(clientRepository);
export const showClientUseCase = new ShowClientUseCase(clientRepository);
export const deleteClientUseCase = new DeleteClientUseCase(clientRepository);
