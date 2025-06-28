import database from "infra/database.js";
import { InternalServerError } from "infra/errors";

async function status(req, res) {
  try {
    const updatedAt = new Date().toISOString();

    const databaseName = process.env.POSTGRES_DB;

    const queryDatabaseVersion = await database.query("SHOW server_version;");
    const databaseVersion = queryDatabaseVersion.rows[0].server_version;

    const maxConnections = await database.query("SHOW max_connections;");

    const openedConnections = await database.query({
      text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName],
    });

    res.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: databaseVersion,
          max_connections: parseInt(maxConnections.rows[0].max_connections),
          opened_connections: openedConnections.rows[0].count,
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });

    console.log("\n Erro dentro do catch do controller:");
    console.error(publicErrorObject);

    res.status(500).json(publicErrorObject);
  }
}

export default status;
