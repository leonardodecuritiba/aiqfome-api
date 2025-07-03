import { createClient } from 'redis';

export class RedisService {
    private client: ReturnType<typeof createClient>;
    private connected = false;

    constructor(url: string) {
        this.client = createClient({ url });
        this.connect();
    }

    private async connect() {
        try {
            await this.client.connect();
            this.connected = true;
        } catch {
            this.connected = false;
        }
    }

    async get<T>(key: string): Promise<T | null> {
        if (!this.connected) return null;

        try {
            const data = await this.client.get(key);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
        if (!this.connected) return false;

        try {
            const serialized = JSON.stringify(value);
            if (ttl) {
                await this.client.setEx(key, ttl, serialized);
            } else {
                await this.client.set(key, serialized);
            }
            return true;
        } catch {
            return false;
        }
    }

    async del(key: string): Promise<boolean> {
        if (!this.connected) return false;

        try {
            const result = await this.client.del(key);
            return result > 0;
        } catch {
            return false;
        }
    }

    async disconnect() {
        if (this.connected) {
            await this.client.quit();
        }
    }
}
