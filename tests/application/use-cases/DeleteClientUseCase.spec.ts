import { ForbiddenError } from './../../../src/application/errors/ForbiddenError';
import { InMemoryClientRepository } from '../../../src/infrastructure/database/in-memory/InMemoryClientRepository';
import { Client } from '../../../src/domain/entities/client.entity';
import { CreateClientUseCase } from '../../../src/application/use-cases/CreateClientUseCase';
import { IClientRepository } from '../../../src/domain/repositories/IClientRepository';
import { DeleteClientUseCase } from '../../../src/application/use-cases/DeleteClientUseCase';

describe('UpdateClientUseCase', () => {
    let clientRepository: IClientRepository;
    let createClientUseCase: CreateClientUseCase;
    let deleteClientUseCase: DeleteClientUseCase;
    let client: Client;
    const originalClientData = {
        name: 'Leonardo Zanin',
        email: 'leonardo.zanin@example.com',
    };

    beforeEach(async () => {
        clientRepository = new InMemoryClientRepository();
        createClientUseCase = new CreateClientUseCase(clientRepository);
        deleteClientUseCase = new DeleteClientUseCase(clientRepository);
        client = await createClientUseCase.execute(originalClientData);
    });

    it('should delete a client successfully', async () => {
        const deletedClient = await deleteClientUseCase.execute(
            { clientId: client.id },
            client.apiKey,
        );
        expect(deletedClient).toBe(true);
    });

    it('should throw an error if the client want delete another client', async () => {
        const clientData = {
            name: 'Leonardo Zanin 2',
            email: 'leonardo@example.com',
        };
        const newClient = await createClientUseCase.execute(clientData);
        await expect(
            deleteClientUseCase.execute({ clientId: client.id }, newClient.apiKey),
        ).rejects.toThrow(ForbiddenError);
    });
});
