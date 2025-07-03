import { Client } from '../../../domain/entities/client.entity';
import { IClientRepository } from '../../../domain/repositories/IClientRepository';
import { RedisService } from '../../cache/RedisService';
import { pool } from './pg-connection';

export class CachedPostgresClientRepository implements IClientRepository {
    private readonly CACHE_PREFIX = 'cliente:';
    private readonly CACHE_TTL = 60 * 60;

    constructor(private readonly cacheService: RedisService) {}

    private getCacheKey(id: string): string {
        return `${this.CACHE_PREFIX}${id}`;
    }

    async create(client: Client): Promise<Client> {
        const query =
            'INSERT INTO clients(id, name, email, apiKey, favorites) VALUES($1, $2, $3, $4, $5) RETURNING *';
        const values = [
            client.id,
            client.name,
            client.email,
            client.apiKey,
            JSON.stringify(client.favorites),
        ];
        const result = await pool.query(query, values);
        return this.mapRowToClient(result.rows[0]);
    }

    async findByEmail(email: string): Promise<Client | null> {
        const query = 'SELECT * FROM clients WHERE email = $1';
        const result = await pool.query(query, [email]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapRowToClient(result.rows[0]);
    }

    async findById(id: string): Promise<Client | null> {
        const query = 'SELECT * FROM clients WHERE id = $1';
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapRowToClient(result.rows[0]);
    }

    async findByApiKey(apiKey: string): Promise<Client | null> {
        const cacheKey = this.getCacheKey(apiKey);

        const cached = await this.cacheService.get<Client>(cacheKey);
        if (cached) {
            return cached;
        }

        const query = 'SELECT * FROM clients WHERE apiKey = $1';
        const result = await pool.query(query, [apiKey]);
        if (result.rows.length === 0) {
            return null;
        }
        const mappedClient = this.mapRowToClient(result.rows[0]);

        await this.cacheService.set(cacheKey, mappedClient, this.CACHE_TTL);

        return mappedClient;
    }

    async update(client: Client): Promise<Client> {
        const query =
            'UPDATE clients SET name = $1, email = $2, favorites = $3 WHERE id = $4 RETURNING *';
        const values = [client.name, client.email, JSON.stringify(client.favorites), client.id];
        const result = await pool.query(query, values);
        const updatedCliente = this.mapRowToClient(result.rows[0]);

        await this.cacheService.set(
            this.getCacheKey(updatedCliente.apiKey),
            updatedCliente,
            this.CACHE_TTL,
        );

        return updatedCliente;
    }

    async delete(id: string): Promise<boolean> {
        const client = await this.findById(id);
        if (!client) {
            return false;
        }
        await this.cacheService.del(this.getCacheKey(client.apiKey));
        const query = 'DELETE FROM clients WHERE id = $1';
        const values = [id];
        const result = await pool.query(query, values);
        return (result.rowCount ?? 0) > 0;
    }

    private mapRowToClient(row: any): Client {
        return new Client({
            id: row.id,
            name: row.name,
            email: row.email,
            apiKey: row.apikey,
            favorites: row.favorites || [],
        });
    }
}
