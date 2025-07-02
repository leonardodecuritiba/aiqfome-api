import { Client } from '../../../domain/entities/client.entity';
import { IClientRepository } from '../../../domain/repositories/IClientRepository';

export class InMemoryClientRepository implements IClientRepository {
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

    async clear(): Promise<void> {
        this.clients = [];
    }
}
