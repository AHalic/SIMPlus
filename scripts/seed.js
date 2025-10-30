import Department from "../models/Department.js";
import mongoose from "mongoose";
import "dotenv/config";

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  /*const depts = [
    { dept_name: "Health" },
    { dept_name: "Clothing" },
    { dept_name: "Food" },
    { dept_name: "Home Goods" },
    { dept_name: "Education" }
  ];

  await Department.insertMany(depts);?*/
  
  console.log("Test data inserted!");

  await mongoose.disconnect();
}

seed().catch(console.error);
