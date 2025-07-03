import { IClientRepository } from '../../domain/repositories/IClientRepository';
import { ClientNotFoundError } from '../errors/ClientNotFoundError';
import { ForbiddenError } from '../errors/ForbiddenError';

interface DeleteClientRequest {
    clientId: string;
}

export class DeleteClientUseCase {
    constructor(private clientRepository: IClientRepository) {}

    async execute({ clientId }: DeleteClientRequest, apiKey: string): Promise<boolean> {
        const client = await this.clientRepository.findByApiKey(apiKey);
        if (!client) {
            throw new ClientNotFoundError();
        }
        if (clientId !== client.id) {
            throw new ForbiddenError();
        }

        return await this.clientRepository.delete(clientId);
    }
}
