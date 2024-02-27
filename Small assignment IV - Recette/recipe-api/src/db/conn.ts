import { Db, MongoClient } from "mongodb";

export const execUsingMongoClient = async (fn: (db: Db) => Promise<any>) => {
  const connectionString = process.env.CONNECTION_STRING || "";
  const client = new MongoClient(connectionString);
  try {
    await client.connect();
    return await fn(client.db("recipes"));
  } catch (ex) {
    console.error(ex);
  } finally {
    await client.close();
  }
};
