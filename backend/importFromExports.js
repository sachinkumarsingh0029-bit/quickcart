// importFromExports.js
// Generic importer: reads JSON exports and uploads them into local MongoDB.
// Assumes each JSON file contains an array of documents.

const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

// Local MongoDB URI (matches your .env)
const MONGO_URI =
  "mongodb://127.0.0.1:27017/test?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.6.0";

// Change this to your actual DB name if it's not "test"
const DB_NAME = "test";

// Auto-detect all JSON exports in: backend/exports/export-2026-02-04T11-00-12
const EXPORT_DIR = path.join(
  __dirname,
  "exports",
  "export-2026-02-04T11-00-12"
);

let collectionsToImport = [];

if (fs.existsSync(EXPORT_DIR)) {
  const files = fs.readdirSync(EXPORT_DIR);
  collectionsToImport = files
    .filter((f) => f.toLowerCase().endsWith(".json"))
    .map((f) => ({
      // collection name = file name without .json
      collectionName: path.basename(f, ".json"),
      filePath: path.join(EXPORT_DIR, f),
    }));
} else {
  console.warn(
    `Export directory not found: ${EXPORT_DIR}. No collections will be imported.`
  );
}

async function importCollection(db, { collectionName, filePath }) {
  console.log(`\nImporting "${collectionName}" from "${filePath}"`);

  if (!fs.existsSync(filePath)) {
    console.warn(`File not found, skipping: ${filePath}`);
    return;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8").trim();
  if (!fileContent) {
    console.warn(`File is empty, skipping: ${filePath}`);
    return;
  }

  let docs;
  try {
    docs = JSON.parse(fileContent);
  } catch (err) {
    console.error(
      `Failed to parse JSON in ${filePath}. Make sure it is a JSON array.`,
      err
    );
    return;
  }

  if (!Array.isArray(docs)) {
    console.error(
      `Expected an array of documents in ${filePath}, got ${typeof docs}`
    );
    return;
  }

  const collection = db.collection(collectionName);

  // OPTIONAL: clear existing data first
  await collection.deleteMany({});
  console.log(`Cleared existing documents in "${collectionName}"`);

  if (docs.length === 0) {
    console.log(`No documents to insert for "${collectionName}"`);
    return;
  }

  const result = await collection.insertMany(docs);
  console.log(
    `Inserted ${result.insertedCount} documents into "${collectionName}"`
  );
}

async function main() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log("Connected to local MongoDB");

    const db = client.db(DB_NAME);

    for (const cfg of collectionsToImport) {
      await importCollection(db, cfg);
    }

    console.log("\n✅ Import completed.");
  } catch (err) {
    console.error("Error during import:", err);
  } finally {
    await client.close();
    console.log("Connection closed.");
  }
}

main();

