import * as mongo from "mongodb";

let cachedDb: mongo.Db | null = null;

export async function connectToDb(uri?: string) {
    if (!cachedDb) {
        if (!uri) {
            uri = process.env.mongodb_uri;
        }
        if (!uri) {
            throw new Error("mongoDB uri not configured");
        }
        const client = await mongo.MongoClient.connect(uri, { useNewUrlParser: true });
        const dbName = new URL(uri).pathname.substr(1);
        console.log("connecting to db:", dbName);
        cachedDb = await client.db(dbName);
    }
    return cachedDb;
}
