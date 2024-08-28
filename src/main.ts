import { Kysely, PostgresDialect, sql } from 'kysely';
import pg from 'pg';
import './env';
console.log(process.env.DATABASE_URL);

interface Database {
  additions: {
    id: number;
    a: number;
    b: number;
    c: number;
  };
}

// Create a connection to the 'postgres' database to check if the 'additions' database exists
const adminDb = new Kysely<{}>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
});

// Create a connection to the 'additions' database (this will fail if it doesn't exist)
const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({
      connectionString: process.env.DATABASE_URL!.replace('/postgres', '/additions'),
    }),
  }),
});

async function setupDatabase() {
  // Check if the 'additions' database exists
  const dbExists = await adminDb
    .selectFrom('pg_database')
    .select(sql<string>`datname`)
    .where('datname', '=', 'additions')
    .executeTakeFirst();

  if (!dbExists) {
    // Create the 'additions' database if it doesn't exist
    await sql`CREATE DATABASE additions`.execute(adminDb);
  }

  // Create the table if it doesn't exist
  await db.schema
    .createTable('additions')
    .ifNotExists()
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('a', 'integer', (col) => col.notNull())
    .addColumn('b', 'integer', (col) => col.notNull())
    .addColumn('c', 'integer', (col) => col.notNull())
    .execute();
}

async function add(a: number, b: number): Promise<number> {
  const c = a + b;
  await db
    .insertInto('additions')
    .values({ a, b, c })
    .execute();
  return c;
}

async function main() {
  await setupDatabase();
  const result = await add(5, 3);
  console.log(`5 + 3 = ${result}`);
  await db.destroy();
  await adminDb.destroy();
}

main().catch(console.error);
