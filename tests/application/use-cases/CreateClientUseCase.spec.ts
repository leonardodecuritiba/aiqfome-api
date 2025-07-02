import { Client } from '../../../src/domain/entities/client.entity';
import { CreateClientUseCase } from '../../../src/application/use-cases/CreateClientUseCase';
import { IClientRepository } from '../../../src/domain/repositories/IClientRepository';
import { EmailAlreadyExistsError } from '../../../src/application/errors/EmailAlreadyExistsError';

class InMemoryClientRepository implements IClientRepository {
    private clients: Client[] = [];

    async create(client: Client): Promise<Client> {
        this.clients.push(client);
        return client;
    }

    async findByEmail(email: string): Promise<Client | null> {
        const client = this.clients.find((c) => c.email === email);
        return client || null;
    }

    async findById(id: string): Promise<Client | null> {
        const client = this.clients.find((c) => c.id === id);
        return client || null;
    }

    async findByApiKey(apiKey: string): Promise<Client | null> {
        const client = this.clients.find((c) => c.apiKey === apiKey);
        return client || null;
    }

    async remove(id: string): Promise<boolean> {
        const clientIndex = this.clients.findIndex((c) => c.id === id);
        if (clientIndex !== -1) {
            this.clients.splice(clientIndex, 1);
            return true;
        }
        return false;
    }

    async update(client: Client): Promise<Client> {
        const clientIndex = this.clients.findIndex((c) => c.id === client.id);
        if (clientIndex > -1) {
            this.clients[clientIndex] = client;
        }
        return client;
    }
}

describe('CreateClientUseCase', () => {
    let clientRepository: IClientRepository;
    let createClientUseCase: CreateClientUseCase;

    beforeEach(() => {
        clientRepository = new InMemoryClientRepository();
        createClientUseCase = new CreateClientUseCase(clientRepository);
    });

    it('should create a new client successfully', async () => {
        const clientData = {
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
        };
        const client = await createClientUseCase.execute(clientData);
        expect(client).toBeInstanceOf(Client);
        expect(client.name).toBe(clientData.name);
        expect(client.email).toBe(clientData.email);
    });

    it('should throw an error if email already exists', async () => {
        const clientData = {
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
        };
        await createClientUseCase.execute(clientData);
        await expect(
            createClientUseCase.execute({
                name: 'Another Name',
                email: 'jane.doe@example.com',
            }),
        ).rejects.toThrow(EmailAlreadyExistsError);
    });
});
