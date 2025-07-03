import { InMemoryClientRepository } from './../../../src/infrastructure/database/in-memory/InMemoryClientRepository';
import { Client } from '../../../src/domain/entities/client.entity';
import { CreateClientUseCase } from '../../../src/application/use-cases/CreateClientUseCase';
import { IClientRepository } from '../../../src/domain/repositories/IClientRepository';
import { EmailAlreadyExistsError } from '../../../src/application/errors/EmailAlreadyExistsError';

describe('CreateClientUseCase', () => {
    let clientRepository: IClientRepository;
    let createClientUseCase: CreateClientUseCase;

    beforeEach(() => {
        clientRepository = new InMemoryClientRepository();
        createClientUseCase = new CreateClientUseCase(clientRepository);
    });

    it('should create a new client successfully', async () => {
        const clientData = {
            name: 'Leonardo Zanin',
            email: 'leonardo.zanin@example.com',
        };
        const client = await createClientUseCase.execute(clientData);
        expect(client).toBeInstanceOf(Client);
        expect(client.name).toBe(clientData.name);
        expect(client.email).toBe(clientData.email);
    });

    it('should throw an error if email already exists', async () => {
        const clientData = {
            name: 'Leonardo Zanin',
            email: 'leonardo.zanin@example.com',
        };
        await createClientUseCase.execute(clientData);
        await expect(
            createClientUseCase.execute({
                name: 'Aiq fome',
                email: 'leonardo.zanin@example.com',
            }),
        ).rejects.toThrow(EmailAlreadyExistsError);
    });
});
