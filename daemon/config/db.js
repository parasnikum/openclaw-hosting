import pg from "pg";
import { config } from "dotenv";
config({ path: "../.env" })
const { Pool } = pg;

const db = new Pool({
  host: process.env.DB_HOST || "pg-394da032-ncername-4ae2.j.aivencloud.com",
  port: process.env.DB_PORT || 12749,
  user: process.env.DB_USER || "avnadmin",
  password: process.env.DB_PASSWORD || "AVNS_vq39ATh-NM6f-7AzolZ",
  database: process.env.DB_NAME || "openclaw",
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  ssl: {
    rejectUnauthorized: false,
  },

});


db.on("error", err => {
  console.error("PG pool error", err);
  process.exit(1);
});

process.on("SIGTERM", async () => {
  await db.end();
  process.exit(0);
});



export default db;