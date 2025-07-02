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
            name: 'Test User',
            email: 'test.user@example.com',
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
            name: 'Existing User',
            email: 'existing.user@example.com',
        };
        await clientRepository.create(new Client(clientData));
        const response = await request(router).post('/clients').send(clientData);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('The provided email already exists.');
    });
});
