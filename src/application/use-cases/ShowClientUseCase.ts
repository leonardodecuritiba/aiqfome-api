import { IClientRepository } from '../../domain/repositories/IClientRepository';
import { Client } from '../../domain/entities/client.entity';
import { ClientNotFoundError } from '../errors/ClientNotFoundError';

interface ShowClientRequest {
    apiKey: string;
}

export class ShowClientUseCase {
    constructor(private clientRepository: IClientRepository) {}
    async execute({ apiKey }: ShowClientRequest): Promise<Client> {
        const client = await this.clientRepository.findByApiKey(apiKey);
        if (!client) {
            throw new ClientNotFoundError();
        }
        return client;
    }
}
