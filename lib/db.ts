import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Some Postgres providers (e.g. Neon) create roles with an empty default
  // search_path, which breaks every unqualified table reference in this
  // app. Force it on each new connection before it's handed out - Neon's
  // pooled connection string doesn't support search_path as a startup
  // parameter, so it has to be set via a query instead.
  async onConnect(client) {
    await client.query("SET search_path TO public");
  },
});

export default pool;
