import { IncomingMessage, ServerResponse } from 'http';
import { z } from 'zod';
import { addFavoriteProductUseCase } from '../container';
import { Client } from '../../domain/entities/client.entity';

const addFavoriteSchema = z.object({
    productId: z.number().int().positive('Invalid Product ID format'),
});

export class FavoriteController {
    async add(req: IncomingMessage, res: ServerResponse, authenticatedClient: Client) {
        const urlParts = req.url?.split('/').filter(Boolean) || [];

        const validationData = {
            productId: parseInt(urlParts[urlParts.length - 1], 10),
        };

        const { productId } = addFavoriteSchema.parse(validationData);

        const client = await addFavoriteProductUseCase.execute({
            clientId: authenticatedClient.id,
            productId,
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(client));
    }
}
