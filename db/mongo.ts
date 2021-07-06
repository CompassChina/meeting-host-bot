import * as mongo from "mongodb";
import { logger } from "../utils/log";

let cachedDb: mongo.Db | null = null;

const L = logger("DB");
export async function connectToDb(uri?: string) {
    if (!cachedDb) {
        if (!uri) {
            uri = process.env.mongodb_uri;
        }
        if (!uri) {
            L.error(`MongoDB's URI not configured`);
            throw new Error("empty MongoDB's URI");
        }
        const client = await mongo.MongoClient.connect(uri, { useNewUrlParser: true });
        const dbName = new URL(uri).pathname.substr(1);
        L.log("Connected to db:", dbName);
        cachedDb = await client.db(dbName);
    }
    return cachedDb;
}
