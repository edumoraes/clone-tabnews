import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import { createRouter } from "next-connect";
import controller from "infra/controller";

const router = createRouter();
router.use(dbClientHandler).get(getHandler).post(postHandler);
export default router.handler(controller.errorHandlers);

let dbClient;
let defaultMigrationOptions;

async function dbClientHandler(req, res, next) {
  dbClient = await database.getConnection();
  defaultMigrationOptions = {
    dbClient: dbClient.client,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  await next();

  dbClient?.client.release();
  await dbClient?.pool.end();
}

async function getHandler(req, res) {
  const pendingMigrations = await migrationRunner(defaultMigrationOptions);

  return res.status(200).json(pendingMigrations);
}

async function postHandler(req, res) {
  const migratedMigrations = await migrationRunner({
    ...defaultMigrationOptions,
    dryRun: false,
  });

  if (migratedMigrations.length > 0) {
    return res.status(201).json(migratedMigrations);
  }
  return res.status(200).json(migratedMigrations);
}
