import request from 'supertest';
import { router } from '../../src/presentation/routes';
import { clientRepository } from '../../src/presentation/container';
import { InMemoryClientRepository } from '../../src/infrastructure/database/in-memory/InMemoryClientRepository';
import { Client } from '../../src/domain/entities/client.entity';

describe('Client Routes Integration', () => {
    beforeEach(async () => {
        if (clientRepository instanceof InMemoryClientRepository) {
            await clientRepository.clear();
        }
    });

    it('POST /clients should create a new client and return it with an apiKey', async () => {
        const clientData = {
            name: 'Leonardo Zanin',
            email: 'leonardo.zanin@example.com',
        };

        const response = await request(router).post('/clients').send(clientData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('apiKey');
        expect(response.body.name).toBe(clientData.name);
        expect(response.body.email).toBe(clientData.email);

        const savedClient = await clientRepository.findByEmail(clientData.email);
        expect(savedClient).not.toBeNull();
        expect(savedClient?.name).toBe(clientData.name);
    });

    it('POST /clients should return 409 if email already exists', async () => {
        const clientData = {
            name: 'Existing Leonardo',
            email: 'leonardo.zanin@example.com',
        };
        await clientRepository.create(new Client(clientData));
        const response = await request(router).post('/clients').send(clientData);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('The provided email already exists.');
    });

    it('GET /clients should show a client with an apiKey', async () => {
        const clientData = {
            name: 'Leonardo Zanin',
            email: 'leonardo.zanin@example.com',
        };
        const savedClient = await clientRepository.create(new Client(clientData));
        const apiKey = savedClient.apiKey;
        const response = await request(router).get('/clients').set('x-api-key', apiKey);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('apiKey');
        expect(response.body.name).toBe(clientData.name);
        expect(response.body.email).toBe(clientData.email);
    });

    it('GET /clients should return 401 if API Key is missing', async () => {
        const apiKey = 'non-existent-api-key';
        const response = await request(router).get('/clients').set('x-api-key', apiKey);
        expect(response.status).toBe(401);
        expect(response.body.message).toContain('Invalid API Key');
    });

    it('PATCH /clients should update a client with an apiKey', async () => {
        const clientData = {
            name: 'Leonardo Zanin',
            email: 'leonardo.zanin@example.com',
        };
        const savedClient = await clientRepository.create(new Client(clientData));
        const apiKey = savedClient.apiKey;

        const updateClientData = {
            name: 'Leonardo Zanin',
            email: 'leonardo@example.com',
        };

        const response = await request(router)
            .patch('/clients')
            .set('x-api-key', apiKey)
            .send(updateClientData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('apiKey');
        expect(response.body.name).toBe(clientData.name);
        expect(response.body.email).not.toBe(clientData.email);
    });

    it('PATCH /clients should return 409 if email already exists', async () => {
        const clientData = {
            name: 'Leonardo Zanin',
            email: 'leonardo.zanin@example.com',
        };
        const savedClient = await clientRepository.create(new Client(clientData));
        const apiKey = savedClient.apiKey;

        const newClientData = {
            name: 'Leonardo 2',
            email: 'leonardo.zanin.2@example.com',
        };
        await clientRepository.create(new Client(newClientData));

        const updateNewClientData = {
            name: 'Leonardo Zanin',
            email: 'leonardo.zanin.2@example.com',
        };

        const response = await request(router)
            .patch('/clients')
            .set('x-api-key', apiKey)
            .send(updateNewClientData);

        expect(response.status).toBe(409);
        expect(response.body.message).toContain('The provided email already exists.');
    });

    it('DELETE /clients should delete a client with an apiKey', async () => {
        const clientData = {
            name: 'Leonardo Zanin',
            email: 'leonardo.zanin@example.com',
        };
        const savedClient = await clientRepository.create(new Client(clientData));
        const apiKey = savedClient.apiKey;
        const response = await request(router)
            .delete(`/clients/${savedClient.id}`)
            .set('x-api-key', apiKey);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Client deleted successfully');
    });

    it('DELETE /clients should return 403 if client want delete another client', async () => {
        const clientData = {
            name: 'Leonardo Zanin',
            email: 'leonardo.zanin@example.com',
        };
        const savedClient = await clientRepository.create(new Client(clientData));
        const apiKey = savedClient.apiKey;
        const newClientData = {
            name: 'Leonardo 2',
            email: 'leonardo.zanin.2@example.com',
        };
        const savedNewClient = await clientRepository.create(new Client(newClientData));

        const response = await request(router)
            .delete(`/clients/${savedNewClient.id}`)
            .set('x-api-key', apiKey);

        expect(response.status).toBe(403);
        expect(response.body.message).toContain(
            'Authorization failed: User is not allowed to perform this action.',
        );
    });
});
