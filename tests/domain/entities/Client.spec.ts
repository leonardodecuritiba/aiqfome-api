import { Client } from '../../../src/domain/entities/client.entity';

describe('Client Entity', () => {
    it('should create a client instance with valid data', () => {
        const client = new Client({
            name: 'Leonardo Zanin',
            email: 'leonardo.zanin@example.com',
        });

        expect(client).toBeInstanceOf(Client);
        expect(client.name).toBe('Leonardo Zanin');
        expect(client.email).toBe('leonardo.zanin@example.com');
        expect(client.id).toBeDefined();
    });
});
