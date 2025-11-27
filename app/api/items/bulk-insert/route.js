import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Item from "../../../../models/Item.js";
import Stock from "../../../../models/Stock.js";
import "dotenv/config";

/**
 * @param {*} request file full of items to be added to stock
 * @returns NextReponse with success or error message
 */
export async function POST(request) {
    const { items } = await request.json()
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }
        for (const itemData of items) {
            const { name, item_id, amount, cost, color, size, type, dept_id } = itemData;

            let item;
            if (item_id && mongoose.Types.ObjectId.isValid(item_id)) {
                let itemId = new mongoose.Types.ObjectId(item_id);
                item = await Item.findById(itemId);
            }
            if (!item) {
                item = await Item.create({
                    item_name: name,
                    type,
                    cost,
                    color,
                    size
                });
            }

            let stock;
            if (dept_id && mongoose.Types.ObjectId.isValid(dept_id)) {
                let deptId = new mongoose.Types.ObjectId(dept_id);
                stock = await Stock.findOne({ item_id: item._id, dept_id: deptId });
            } 
            if (!stock) {
                stock = await Stock.create({
                    item_id: item._id,
                    amount,
                    dept_id,
                });
            } else {
                stock.amount += amount;
                await stock.save();
            }
        }

        return NextResponse.json(
            { message: "success" },
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error("Error adding items:", error);
        return NextResponse.json(
            { error: "Failed to add items", details: error.message },
            { status: 500 }
        );
    }
}
