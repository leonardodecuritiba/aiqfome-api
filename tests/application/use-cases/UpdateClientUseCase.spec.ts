import { UpdateClientUseCase } from './../../../src/application/use-cases/UpdateClientUseCase';
import { InMemoryClientRepository } from '../../../src/infrastructure/database/in-memory/InMemoryClientRepository';
import { Client } from '../../../src/domain/entities/client.entity';
import { CreateClientUseCase } from '../../../src/application/use-cases/CreateClientUseCase';
import { IClientRepository } from '../../../src/domain/repositories/IClientRepository';
import { EmailAlreadyExistsError } from '../../../src/application/errors/EmailAlreadyExistsError';

describe('UpdateClientUseCase', () => {
    let clientRepository: IClientRepository;
    let createClientUseCase: CreateClientUseCase;
    let updateClientUseCase: UpdateClientUseCase;
    let client: Client;
    const originalClientData = {
        name: 'Leonardo Zanin',
        email: 'leonardo.zanin@example.com',
    };

    beforeEach(async () => {
        clientRepository = new InMemoryClientRepository();
        createClientUseCase = new CreateClientUseCase(clientRepository);
        updateClientUseCase = new UpdateClientUseCase(clientRepository);
        client = await createClientUseCase.execute(originalClientData);
    });

    it('should update a client successfully', async () => {
        const clientData = {
            name: 'Leonardo Zanin',
            email: 'leonardo@example.com',
        };
        const updatedClient = await updateClientUseCase.execute(clientData, client.apiKey);
        expect(updatedClient).toBeInstanceOf(Client);
        expect(updatedClient.name).toBe(clientData.name);
        expect(updatedClient.email).not.toBe(originalClientData.email);
    });

    it('should throw an error if the email is duplicated', async () => {
        const newClientData = {
            name: 'Leonardo 2',
            email: 'leonardo_duplicated@example.com',
        };
        await createClientUseCase.execute(newClientData);
        const clientData = {
            name: 'Leonardo Zanin',
            email: 'leonardo_duplicated@example.com',
        };
        await expect(updateClientUseCase.execute(clientData, client.apiKey)).rejects.toThrow(
            EmailAlreadyExistsError,
        );
    });
});
