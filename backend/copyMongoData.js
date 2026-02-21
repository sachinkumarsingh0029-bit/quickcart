// copyMongoData.js
const { MongoClient } = require("mongodb");

const SOURCE_URI =
  "mongodb://ritik1234:ritik1234@cluster0.gn9tz5s.mongodb.net/test";
const TARGET_URI = "mongodb://127.0.0.1:27017";

// change this if your DB name is not "test"
const DB_NAME = "test";

async function copyDatabase() {
  const sourceClient = new MongoClient(SOURCE_URI);
  const targetClient = new MongoClient(TARGET_URI);

  try {
    await sourceClient.connect();
    await targetClient.connect();

    console.log("Connected to both source (Atlas) and target (local)");

    const sourceDb = sourceClient.db(DB_NAME);
    const targetDb = targetClient.db(DB_NAME);

    const collections = await sourceDb.listCollections().toArray();
    console.log(
      "Collections to copy:",
      collections.map((c) => c.name)
    );

    for (const { name } of collections) {
      console.log(`\nCopying collection: ${name}`);

      const sourceCol = sourceDb.collection(name);
      const targetCol = targetDb.collection(name);

      // OPTIONAL: clear existing data in target collection
      await targetCol.deleteMany({});
      console.log(`Cleared target collection "${name}"`);

      const cursor = sourceCol.find({});
      const docs = await cursor.toArray();

      if (docs.length === 0) {
        console.log(`No documents to copy in "${name}"`);
        continue;
      }

      const result = await targetCol.insertMany(docs);
      console.log(
        `Inserted ${result.insertedCount} documents into "${name}"`
      );
    }

    console.log("\n✅ Copy completed.");
  } catch (err) {
    console.error("Error during copy:", err);
  } finally {
    await sourceClient.close();
    await targetClient.close();
    console.log("Connections closed.");
  }
}

copyDatabase();