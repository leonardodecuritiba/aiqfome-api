import { IClientRepository } from '../../domain/repositories/IClientRepository';
import { Client } from '../../domain/entities/client.entity';
import { EmailAlreadyExistsError } from '../errors/EmailAlreadyExistsError';
import { ClientNotFoundError } from '../errors/ClientNotFoundError';

interface UpdateClientRequest {
    name: string;
    email: string;
}

export class UpdateClientUseCase {
    constructor(private clientRepository: IClientRepository) {}

    async execute({ name, email }: UpdateClientRequest, apiKey: string): Promise<Client> {
        const client = await this.clientRepository.findByApiKey(apiKey);
        if (!client) {
            throw new ClientNotFoundError();
        }
        const emailExists = await this.clientRepository.findByEmail(email);
        if (emailExists && emailExists.id !== client.id) {
            throw new EmailAlreadyExistsError();
        }

        client.name = name;
        client.email = email;
        await this.clientRepository.update(client);

        return client;
    }
}
