import { createClientsTable, pool } from './src/infrastructure/database/postgres/pg-connection';

async function setup() {
    console.log('Setting up the database...');
    await createClientsTable();
    console.log('Database setup complete.');
    await pool.end();
}

setup().catch((err) => {
    console.error('Failed to setup database:', err);
    process.exit(1);
});
