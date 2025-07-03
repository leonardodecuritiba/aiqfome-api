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

        const clientRouteMatch = url?.startsWith('/clients');
        if (clientRouteMatch) {
            if (method === 'POST') {
                return await clientController.create(req, res);
            }
            const authenticatedClient = await auth(req);
            if (method === 'GET') {
                return await clientController.show(req, res, authenticatedClient);
            }
            if (method === 'PATCH') {
                return await clientController.update(req, res, authenticatedClient);
            }
            if (method === 'DELETE') {
                return await clientController.delete(req, res, authenticatedClient);
            }
        }

        const favoriteRouteMatch = url?.match(/^\/favorites\/(\d+)$/);
        if (favoriteRouteMatch) {
            const authenticatedClient = await auth(req);
            if (method === 'POST') {
                return await favoriteController.add(req, res, authenticatedClient);
            }
            if (method === 'DELETE') {
                return await favoriteController.remove(req, res, authenticatedClient);
            }
        }

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route Not Found' }));
    } catch (error) {
        errorHandler(res, error);
    }
};
