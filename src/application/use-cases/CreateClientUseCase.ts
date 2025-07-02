import { IClientRepository } from '../../domain/repositories/IClientRepository';
import { Client } from '../../domain/entities/client.entity';
import { EmailAlreadyExistsError } from '../errors/EmailAlreadyExistsError';

interface CreateClientRequest {
    name: string;
    email: string;
}

export class CreateClientUseCase {
    constructor(private clientRepository: IClientRepository) {}

    async execute({ name, email }: CreateClientRequest): Promise<Client> {
        const emailExists = await this.clientRepository.findByEmail(email);
        if (emailExists) {
            throw new EmailAlreadyExistsError();
        }
        const client = new Client({ name, email });
        await this.clientRepository.create(client);
        return client;
    }
}
