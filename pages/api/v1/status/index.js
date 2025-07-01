import { createRouter } from "next-connect";
import database from "infra/database.js";
import controller from "infra/controller";

const router = createRouter();
router.get(getHandler);
export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
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
}
