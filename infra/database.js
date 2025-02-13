import { Pool } from "pg";

const config = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.NODE_ENV === "production" ? true : false,
};

async function query(queryObject) {
  let connection;
  let client;

  try {
    connection = await getConnection();
    client = connection.client;
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client.release();
    await connection.pool.end();
  }
}

async function getConnection() {
  const pool = new Pool(config);

  pool.on("error", (err, client) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
  });

  const client = await pool.connect();

  return { pool: pool, client: client };
}
export default {
  query,
  getConnection,
};
