import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";

let defaultMigrationOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getConnection();
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient: dbClient.client,
    });

    return pendingMigrations;
  } finally {
    dbClient?.client.release();
    await dbClient?.pool.end();
  }
}

async function runPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getConnection();

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient: dbClient.client,
      dryRun: false,
    });

    return migratedMigrations;
  } finally {
    dbClient?.client.release();
    await dbClient?.pool.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
