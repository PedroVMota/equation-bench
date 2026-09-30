import "server-only";

import { mkdirSync } from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

const DB_DIR = path.join(process.cwd(), "data");

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS documents (
    id         TEXT PRIMARY KEY,
    title      TEXT NOT NULL,
    content    TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS documents_updated_at ON documents (updated_at DESC);
`;

// Dev hot reload re-evaluates modules; keep one connection on globalThis.
const globalForDb = globalThis as unknown as { equationBenchDb?: Database.Database };

function openDatabase(): Database.Database {
  mkdirSync(DB_DIR, { recursive: true });
  const db = new Database(path.join(DB_DIR, "equation-bench.db"));
  db.pragma("journal_mode = WAL");
  db.exec(SCHEMA);
  return db;
}

export function getDatabase(): Database.Database {
  globalForDb.equationBenchDb ??= openDatabase();
  return globalForDb.equationBenchDb;
}
