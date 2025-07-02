import { IncomingMessage, ServerResponse } from 'http';
import { ClientController } from './controllers/ClientController';
import { FavoriteController } from './controllers/FavoriteController';
import { errorHandler } from './middlewares/errorHandler';
import { auth } from './middlewares/auth';

const clientController = new ClientController();
const favoriteController = new FavoriteController();

export const router = async (req: IncomingMessage, res: ServerResponse) => {
    try {
        const { method, url } = req;

        if (method === 'POST' && url === '/clients') {
            return await clientController.create(req, res);
        }

        const favoriteRouteMatch = url?.match(/^\/favorites\/(\d+)$/);
        if (method === 'POST' && favoriteRouteMatch) {
            const authenticatedClient = await auth(req);
            return await favoriteController.add(req, res, authenticatedClient);
        }

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    } catch (error) {
        errorHandler(res, error);
    }
};
