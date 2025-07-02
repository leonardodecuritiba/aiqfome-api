import { IncomingMessage } from 'http';
import { UnauthorizedError } from '../../application/errors/UnauthorizedError';
import { Client } from '../../domain/entities/client.entity';
import { clientRepository } from '../container';

export const auth = async (req: IncomingMessage): Promise<Client> => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || typeof apiKey !== 'string') {
        throw new UnauthorizedError('API Key is missing or invalid.');
    }

    const client = await clientRepository.findByApiKey(apiKey);

    if (!client) {
        throw new UnauthorizedError('Invalid API Key.');
    }

    return client;
};
