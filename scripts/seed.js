import Department from "../models/Department.js";
import Item from "../models/Item.js";
import Stock from "../models/Stock.js";
import Transaction from "../models/Transaction.js";
import Item_Sold from "../models/Item_Sold.js";
import { PaymentEnum } from "../models/Enum.js";
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
  ];
  await Item.insertMany(items);

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

  const transac = [
    { returned_id: null, payment_method: PaymentEnum[0] },
    { returned_id: null, payment_method: PaymentEnum[1] },
    { returned_id: null, payment_method: PaymentEnum[2] },
    { returned_id: null, payment_method: PaymentEnum[2] },
    { returned_id: null, payment_method: PaymentEnum[0] },
    { returned_id: null, payment_method: PaymentEnum[0] },
    { returned_id: null, payment_method: PaymentEnum[1] },
    { returned_id: null, payment_method: PaymentEnum[1] },
    { returned_id: null, payment_method: PaymentEnum[2] },
    { returned_id: null, payment_method: PaymentEnum[1] },
    { returned_id: null, payment_method: PaymentEnum[0] }
  ];
  await Transaction.insertMany(transac);

  const transactions = await Transaction.find({}, "_id");
  const ids = transactions.map(tx => tx._id);

  const sold = [
    { transaction_id: ids[0], item_id: (await Item.findOne({ item_name: "Plates" }))._id, amount_sold: 2, sell_price: (await Item.findOne({ item_name: "Plates" })).cost },
    { transaction_id: ids[0], item_id: (await Item.findOne({ item_name: "Coffee Mug" }))._id, amount_sold: 7, sell_price: (await Item.findOne({ item_name: "Coffee Mug" })).cost },
    { transaction_id: ids[1], item_id: (await Item.findOne({ item_name: "T-shirt" }))._id, amount_sold: 1, sell_price: (await Item.findOne({ item_name: "T-shirt" })).cost },
    { transaction_id: ids[1], item_id: (await Item.findOne({ item_name: "Jeans" }))._id, amount_sold: 1, sell_price: (await Item.findOne({ item_name: "Jeans" })).cost },
    { transaction_id: ids[2], item_id: (await Item.findOne({ item_name: "Jeans" }))._id, amount_sold: 3, sell_price: (await Item.findOne({ item_name: "Jeans" })).cost },
    { transaction_id: ids[2], item_id: (await Item.findOne({ item_name: "Jacket" }))._id, amount_sold: 1, sell_price: (await Item.findOne({ item_name: "Jacket" })).cost },
    { transaction_id: ids[3], item_id: (await Item.findOne({ item_name: "Sneakers" }))._id, amount_sold: 1, sell_price: (await Item.findOne({ item_name: "Sneakers" })).cost },
    { transaction_id: ids[3], item_id: (await Item.findOne({ item_name: "Lamp" }))._id, amount_sold: 4, sell_price: (await Item.findOne({ item_name: "Lamp" })).cost },
    { transaction_id: ids[4], item_id: (await Item.findOne({ item_name: "Notebook" }))._id, amount_sold: 8, sell_price: (await Item.findOne({ item_name: "Notebook" })).cost },
    { transaction_id: ids[4], item_id: (await Item.findOne({ item_name: "Coffee Mug" }))._id, amount_sold: 2, sell_price: (await Item.findOne({ item_name: "Coffee Mug" })).cost },
    { transaction_id: ids[5], item_id: (await Item.findOne({ item_name: "Notebook" }))._id, amount_sold: 5, sell_price: (await Item.findOne({ item_name: "Notebook" })).cost },
    { transaction_id: ids[5], item_id: (await Item.findOne({ item_name: "Plates" }))._id, amount_sold: 12, sell_price: (await Item.findOne({ item_name: "Plates" })).cost },
    { transaction_id: ids[6], item_id: (await Item.findOne({ item_name: "Plates" }))._id, amount_sold: 10, sell_price: (await Item.findOne({ item_name: "Plates" })).cost },
    { transaction_id: ids[6], item_id: (await Item.findOne({ item_name: "Water Bottle" }))._id, amount_sold: 1, sell_price: (await Item.findOne({ item_name: "Water Bottle" })).cost },
    { transaction_id: ids[7], item_id: (await Item.findOne({ item_name: "Lamp" }))._id, amount_sold: 1, sell_price: (await Item.findOne({ item_name: "Lamp" })).cost },
    { transaction_id: ids[7], item_id: (await Item.findOne({ item_name: "Sneakers" }))._id, amount_sold: 2, sell_price: (await Item.findOne({ item_name: "Sneakers" })).cost },
    { transaction_id: ids[8], item_id: (await Item.findOne({ item_name: "Jacket" }))._id, amount_sold: 1, sell_price: (await Item.findOne({ item_name: "Jacket" })).cost },
    { transaction_id: ids[8], item_id: (await Item.findOne({ item_name: "Lamp" }))._id, amount_sold: 4, sell_price: (await Item.findOne({ item_name: "Lamp" })).cost },
    { transaction_id: ids[9], item_id: (await Item.findOne({ item_name: "Water Bottle" }))._id, amount_sold: 2, sell_price: (await Item.findOne({ item_name: "Water Bottle" })).cost },
    { transaction_id: ids[9], item_id: (await Item.findOne({ item_name: "T-shirt" }))._id, amount_sold: 2, sell_price: (await Item.findOne({ item_name: "T-shirt" })).cost },
    { transaction_id: ids[10], item_id: (await Item.findOne({ item_name: "Coffee Mug" }))._id, amount_sold: 4, sell_price: (await Item.findOne({ item_name: "Coffee Mug" })).cost },
    { transaction_id: ids[10], item_id: (await Item.findOne({ item_name: "Water Bottle" }))._id, amount_sold: 1, sell_price: (await Item.findOne({ item_name: "Water Bottle" })).cost },
  ];
  await Item_Sold.insertMany(sold);

  const items2 = [
    { item_name: "Cheese", type: "dairy", cost: 7.75, color: null, size: null },
    { item_name: "Strawberries", type: "fruit", cost: 4.50, color: null, size: null },
    { item_name: "Coffee", type: "drink", cost: 12.25, color: null, size: null },
    { item_name: "Chicken", type: "meat", cost: 5.5, color: null, size: null },
    { item_name: "Beef", type: "meat", cost: 6.25, color: null, size: null },
    { item_name: "Bananas", type: "fruit", cost: 8.50, color: null, size: null },
    { item_name: "Cola", type: "drink", cost: 2.50, color: null, size: null },
    { item_name: "Lettuce", type: "vegetable", cost: 3.75, color: null, size: null },
  ];
  await Item.insertMany(items2);

  const stock2 = [
    { item_id: (await Item.findOne({ item_name: "Cheese" }))._id, dept_id: (await Department.findOne({ dept_name: "Food" }))._id, amount: 25 },
    { item_id: (await Item.findOne({ item_name: "Strawberries" }))._id, dept_id: (await Department.findOne({ dept_name: "Food" }))._id, amount: 150 },
    { item_id: (await Item.findOne({ item_name: "Coffee" }))._id, dept_id: (await Department.findOne({ dept_name: "Food" }))._id, amount: 50 },
    { item_id: (await Item.findOne({ item_name: "Chicken" }))._id, dept_id: (await Department.findOne({ dept_name: "Food" }))._id, amount: 30 },
    { item_id: (await Item.findOne({ item_name: "Beef" }))._id, dept_id: (await Department.findOne({ dept_name: "Food" }))._id, amount: 40 },
    { item_id: (await Item.findOne({ item_name: "Bananas" }))._id, dept_id: (await Department.findOne({ dept_name: "Food" }))._id, amount: 60 },
    { item_id: (await Item.findOne({ item_name: "Cola" }))._id, dept_id: (await Department.findOne({ dept_name: "Food" }))._id, amount: 120 },
    { item_id: (await Item.findOne({ item_name: "Lettuce" }))._id, dept_id: (await Department.findOne({ dept_name: "Food" }))._id, amount: 50 },
  ];
  await Stock.insertMany(stock2);*/

  const transac2 = [
    { returned_id: null, payment_method: PaymentEnum[0] },
    { returned_id: null, payment_method: PaymentEnum[0] },
    { returned_id: null, payment_method: PaymentEnum[2] },
    { returned_id: null, payment_method: PaymentEnum[2] },
    { returned_id: null, payment_method: PaymentEnum[2] },
    { returned_id: null, payment_method: PaymentEnum[1] },
    { returned_id: null, payment_method: PaymentEnum[1] },
    { returned_id: null, payment_method: PaymentEnum[1] },
    { returned_id: null, payment_method: PaymentEnum[0] }
  ];
  //await Transaction.insertMany(transac2);

  const transactions = await Transaction.find({}, "_id");
  const ids = transactions.map(tx => tx._id);

  const sold2 = [
    { transaction_id: ids[11], item_id: (await Item.findOne({ item_name: "Cheese" }))._id, amount_sold: 2, sell_price: (await Item.findOne({ item_name: "Cheese" })).cost },
    { transaction_id: ids[11], item_id: (await Item.findOne({ item_name: "Beef" }))._id, amount_sold: 1, sell_price: (await Item.findOne({ item_name: "Beef" })).cost },
    { transaction_id: ids[11], item_id: (await Item.findOne({ item_name: "Chicken" }))._id, amount_sold: 2, sell_price: (await Item.findOne({ item_name: "Chicken" })).cost },
    { transaction_id: ids[12], item_id: (await Item.findOne({ item_name: "Coffee" }))._id, amount_sold: 1, sell_price: (await Item.findOne({ item_name: "Coffee" })).cost },
    { transaction_id: ids[12], item_id: (await Item.findOne({ item_name: "Chicken" }))._id, amount_sold: 1, sell_price: (await Item.findOne({ item_name: "Chicken" })).cost },
    { transaction_id: ids[13], item_id: (await Item.findOne({ item_name: "Cola" }))._id, amount_sold: 3, sell_price: (await Item.findOne({ item_name: "Cola" })).cost },
    { transaction_id: ids[13], item_id: (await Item.findOne({ item_name: "Bananas" }))._id, amount_sold: 6, sell_price: (await Item.findOne({ item_name: "Bananas" })).cost },
    { transaction_id: ids[13], item_id: (await Item.findOne({ item_name: "Lettuce" }))._id, amount_sold: 2, sell_price: (await Item.findOne({ item_name: "Lettuce" })).cost },
    { transaction_id: ids[14], item_id: (await Item.findOne({ item_name: "Cola" }))._id, amount_sold: 6, sell_price: (await Item.findOne({ item_name: "Cola" })).cost },
    { transaction_id: ids[15], item_id: (await Item.findOne({ item_name: "Coffee" }))._id, amount_sold: 1, sell_price: (await Item.findOne({ item_name: "Coffee" })).cost },
    { transaction_id: ids[15], item_id: (await Item.findOne({ item_name: "Strawberries" }))._id, amount_sold: 3, sell_price: (await Item.findOne({ item_name: "Strawberries" })).cost },
    { transaction_id: ids[16], item_id: (await Item.findOne({ item_name: "Chicken" }))._id, amount_sold: 2, sell_price: (await Item.findOne({ item_name: "Chicken" })).cost },
    { transaction_id: ids[17], item_id: (await Item.findOne({ item_name: "Beef" }))._id, amount_sold: 1, sell_price: (await Item.findOne({ item_name: "Beef" })).cost },
    { transaction_id: ids[17], item_id: (await Item.findOne({ item_name: "Strawberries" }))._id, amount_sold: 3, sell_price: (await Item.findOne({ item_name: "Strawberries" })).cost },
    { transaction_id: ids[17], item_id: (await Item.findOne({ item_name: "Bananas" }))._id, amount_sold: 3, sell_price: (await Item.findOne({ item_name: "Bananas" })).cost },
    { transaction_id: ids[18], item_id: (await Item.findOne({ item_name: "Lettuce" }))._id, amount_sold: 2, sell_price: (await Item.findOne({ item_name: "Lettuce" })).cost },
    { transaction_id: ids[19], item_id: (await Item.findOne({ item_name: "Cola" }))._id, amount_sold: 2, sell_price: (await Item.findOne({ item_name: "Cola" })).cost },
    { transaction_id: ids[19], item_id: (await Item.findOne({ item_name: "Cheese" }))._id, amount_sold: 1, sell_price: (await Item.findOne({ item_name: "Cheese" })).cost }
  ];
  await Item_Sold.insertMany(sold2);

  console.log("Test data inserted!");

  await mongoose.disconnect();
}

seed().catch(console.error);
