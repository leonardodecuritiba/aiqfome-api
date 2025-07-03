import { Client } from '../entities/client.entity';

export interface IClientRepository {
    create(client: Client): Promise<Client>;
    findByEmail(email: string): Promise<Client | null>;
    findById(id: string): Promise<Client | null>;
    findByApiKey(apiKey: string): Promise<Client | null>;
    update(client: Client): Promise<Client>;
    delete(id: string): Promise<boolean>;
}
