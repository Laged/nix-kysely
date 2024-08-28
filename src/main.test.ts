import { expect, test } from "bun:test";
import { Kysely, PostgresDialect, sql } from 'kysely';
import pg from 'pg';

interface Database {
  additions: {
    id: number;
    a: number;
    b: number;
    c: number;
  };
}

// Create a connection to the 'additions' database
const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({
      connectionString: process.env.DATABASE_URL!.replace('/postgres', '/additions'),
    }),
  }),
});

async function setupDatabase() {
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

test("addition and database insert", async () => {
  // Ensure the table is set up
  await setupDatabase();

  // Perform an addition and insert the result
  const result = await add(2, 3);
  expect(result).toBe(5);

  // Query the database to ensure the data was inserted correctly
  const dbResult = await db
    .selectFrom('additions')
    .select(['a', 'b', 'c'])
    .where('a', '=', 2)
    .where('b', '=', 3)
    .executeTakeFirst();

  expect(dbResult).toEqual({ a: 2, b: 3, c: 5 });

  // Clean up
  await db.destroy();
});
