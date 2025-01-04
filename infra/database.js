import { Pool } from "pg";

const config = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
}

async function query(queryObject) {
  const pool = new Pool(config);

  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1)
  })

  let client;

  try {

    client = await pool.connect();
    const result = await client.query(queryObject);
    
    return result;
    
  } catch (error) {
    console.error(error);
    throw error;
    
  } finally {
    
    client.release();
    await pool.end();
  }

    
    
  
}

export default {
  query: query,
};
