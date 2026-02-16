// npm install mysql2
import mysql from "mysql2/promise";
import fs from "fs";

// === Your DB URL (just this is enough) ===
const DB_URL = "mysql://avnadmin:AVNS_J5xF_lqZUnnQaQZSfIt@mysql-1d366dc5-ncername-4ae2.l.aivencloud.com:12749/defaultdb?ssl-mode=REQUIRED";

// Optional: path to SSL CA
const SSL_CA_PATH = "ca.pem";

(async () => {
  let connection;

  try {
    // Parse URL automatically
    const parsedUrl = new URL(DB_URL);
    const DB_NAME = parsedUrl.pathname.replace(/^\//, ""); // remove leading '/'
    
    const connectionConfig = {
      host: "mysql-1d366dc5-ncername-4ae2.l.aivencloud.com",
      port:  12749,
      user: "avnadmin",
      password: "AVNS_J5xF_lqZUnnQaQZSfIt",
      database: "defaultdb",
      // SSL only if CA is provided
      ssl: SSL_CA_PATH ? { ca: fs.readFileSync(SSL_CA_PATH) } : undefined
    };

    connection = await mysql.createConnection(connectionConfig);

    // Fetch schema
    const [rows] = await connection.query(
      `
      SELECT
        table_name,
        column_name,
        column_type,
        is_nullable,
        column_default,
        column_key,
        extra
      FROM information_schema.columns
      WHERE table_schema = ?
      ORDER BY table_name, ordinal_position
      `,
      [DB_NAME]
    );

    // Convert to JSON
    const schema = {};
    rows.forEach((row) => {
      const table = row.table_name;
      if (!table) return; // skip rows without table name
      if (!schema[table]) schema[table] = [];

      schema[table].push({
        name: row.column_name,
        type: row.column_type,
        nullable: row.is_nullable === "YES",
        default: row.column_default,
        key: row.column_key,
        extra: row.extra
      });
    });


  } catch (err) {
    console.error("Error fetching schema:", err);
  } finally {
    if (connection) await connection.end();
  }
})();
