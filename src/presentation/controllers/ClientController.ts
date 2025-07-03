import { IncomingMessage, ServerResponse } from 'http';
import { z } from 'zod';
import {
    createClientUseCase,
    showClientUseCase,
    updateClientUseCase,
    deleteClientUseCase,
} from '../container';
import { Client } from '../../domain/entities/client.entity';

const clientSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
});
const IdSchema = z.object({
    clientId: z.string().min(1, 'Client ID is required').uuid('Invalid Client ID format'),
});

async function getBody(req: IncomingMessage): Promise<any> {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', (chunk) => (body += chunk.toString()));
        req.on('end', () => resolve(JSON.parse(body || '{}')));
    });
}

export class ClientController {
    async create(req: IncomingMessage, res: ServerResponse) {
        const body = await getBody(req);
        const { name, email } = clientSchema.parse(body);

        const client = await createClientUseCase.execute({ name, email });

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(client));
    }

    async show(req: IncomingMessage, res: ServerResponse, authenticatedClient: Client) {
        const client = await showClientUseCase.execute(authenticatedClient);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(client));
    }

    async update(req: IncomingMessage, res: ServerResponse, authenticatedClient: Client) {
        const body = await getBody(req);
        const { name, email } = clientSchema.parse(body);

        const client = await updateClientUseCase.execute(
            { name, email },
            authenticatedClient.apiKey,
        );

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(client));
    }

    async delete(req: IncomingMessage, res: ServerResponse, authenticatedClient: Client) {
        const urlParts = req.url?.split('/').filter(Boolean) || [];
        const validationData = {
            clientId: urlParts[urlParts.length - 1],
        };
        const clientValidated = IdSchema.parse(validationData);
        const client = await deleteClientUseCase.execute(
            clientValidated,
            authenticatedClient.apiKey,
        );

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Client deleted successfully' }));
    }
}
