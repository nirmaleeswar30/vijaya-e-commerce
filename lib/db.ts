// lib/db.ts
import { Pool } from 'pg';

// Create a new pool of connections.
// A pool is better than a single client for handling multiple concurrent requests.
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default pool;