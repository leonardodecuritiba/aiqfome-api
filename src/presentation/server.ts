import { createServer } from 'http';
import { router } from './routes';

const PORT = process.env.APP_PORT || 3000;

const server = createServer((req, res) => {
    router(req, res);
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
