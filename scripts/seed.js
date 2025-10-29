import { connectToDatabase } from "../lib/mongodb.js";

async function seed() {
  const client = await connectToDatabase();
  const db = client.db();
  const collection = db.collection("Department");

  // Example data array
  const testData = [
    { dept_name: "Health" },
    { dept_name: "Clothing" },
    { dept_name: "Food" },
    { dept_name: "Home Goods" }
  ];

  // Insert data
  await collection.insertMany(testData);
  console.log("Test data inserted!");

  await client.close();
}

seed().catch(console.error);