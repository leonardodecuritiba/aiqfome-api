import { ShowClientUseCase } from './../../../src/application/use-cases/ShowClientUseCase';
import { InMemoryClientRepository } from './../../../src/infrastructure/database/in-memory/InMemoryClientRepository';
import { Client } from '../../../src/domain/entities/client.entity';
import { CreateClientUseCase } from '../../../src/application/use-cases/CreateClientUseCase';
import { IClientRepository } from '../../../src/domain/repositories/IClientRepository';
import { ClientNotFoundError } from '../../../src/application/errors/ClientNotFoundError';

describe('ShowClientUseCase', () => {
    let clientRepository: IClientRepository;
    let createClientUseCase: CreateClientUseCase;
    let showClientUseCase: ShowClientUseCase;
    let client: Client;

    beforeEach(async () => {
        clientRepository = new InMemoryClientRepository();
        createClientUseCase = new CreateClientUseCase(clientRepository);
        showClientUseCase = new ShowClientUseCase(clientRepository);
        const clientData = {
            name: 'Leonardo Zanin',
            email: 'leonardo.zanin@example.com',
        };
        client = await createClientUseCase.execute(clientData);
    });

    it('should show a client successfully', async () => {
        const authenticatedClient = await showClientUseCase.execute({ apiKey: client.apiKey });
        expect(authenticatedClient).toBeInstanceOf(Client);
    });

    it('should throw an error ', async () => {
        const apiKey = 'non-existent-api-key';
        await expect(showClientUseCase.execute({ apiKey: apiKey })).rejects.toThrow(
            ClientNotFoundError,
        );
    });
});
