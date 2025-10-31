import Department from "../models/Department.js";
import Item from "../models/Item.js";
import Stock from "../models/Stock.js";
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

  await Department.insertMany(depts);

  const items = [
    { item_name: "Plates", type: "kitchenware", cost: 12, color: "white", size: null },
    { item_name: "T-shirt", type: "tops", cost: 6, color: "black", size: "S" },
    { item_name: "Coffee Mug", type: "kitchenware", cost: 8, color: "blue", size: null },
    { item_name: "Jeans", type: "bottoms", cost: 25, color: "denim", size: "M" },
    { item_name: "Notebook", type: "stationery", cost: 5, color: "green", size: null },
    { item_name: "Lamp", type: "home decor", cost: 20, color: "yellow", size: null },
    { item_name: "Sneakers", type: "footwear", cost: 40, color: "white", size: "10" },
    { item_name: "Jacket", type: "outerwear", cost: 50, color: "red", size: "L" },
    { item_name: "Backpack", type: "accessory", cost: 30, color: "black", size: null },
    { item_name: "Water Bottle", type: "kitchenware", cost: 10, color: "silver", size: null }
  ];*/

  const stock = [
    { item_id: (await Item.findOne({ item_name: "Plates" }))._id, dept_id: (await Department.findOne({ dept_name: "Home Goods" }))._id, amount: 50 },
    { item_id: (await Item.findOne({ item_name: "T-shirt" }))._id, dept_id: (await Department.findOne({ dept_name: "Clothing" }))._id, amount: 100 },
    { item_id: (await Item.findOne({ item_name: "Coffee Mug" }))._id, dept_id: (await Department.findOne({ dept_name: "Home Goods" }))._id, amount: 75 },
    { item_id: (await Item.findOne({ item_name: "Jeans" }))._id, dept_id: (await Department.findOne({ dept_name: "Clothing" }))._id, amount: 60 },
    { item_id: (await Item.findOne({ item_name: "Notebook" }))._id, dept_id: (await Department.findOne({ dept_name: "Education" }))._id, amount: 200 },
    { item_id: (await Item.findOne({ item_name: "Lamp" }))._id, dept_id: (await Department.findOne({ dept_name: "Home Goods" }))._id, amount: 40 },
    { item_id: (await Item.findOne({ item_name: "Sneakers" }))._id, dept_id: (await Department.findOne({ dept_name: "Clothing" }))._id, amount: 80 },
    { item_id: (await Item.findOne({ item_name: "Jacket" }))._id, dept_id: (await Department.findOne({ dept_name: "Clothing" }))._id, amount: 30 },
    { item_id: (await Item.findOne({ item_name: "Backpack" }))._id, dept_id: (await Department.findOne({ dept_name: "Education" }))._id, amount: 90 },
    { item_id: (await Item.findOne({ item_name: "Water Bottle" }))._id, dept_id: (await Department.findOne({ dept_name: "Health" }))._id, amount: 120 }
  ];

  await Stock.insertMany(stock);

  console.log("Test data inserted!");

  await mongoose.disconnect();
}

seed().catch(console.error);
