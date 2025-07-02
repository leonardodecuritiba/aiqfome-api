import { IncomingMessage, ServerResponse } from 'http';
import { z } from 'zod';
import { createClientUseCase } from '../container';

const createClientSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
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
        const { name, email } = createClientSchema.parse(body);

        const client = await createClientUseCase.execute({ name, email });

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(client));
    }
}
