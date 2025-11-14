import { NextResponse } from "next/server";
import Transaction from "../../../models/Transaction.js";
import Item_Sold from "../../../models/Item_Sold.js";
import Item from "../../../models/Item.js";
import mongoose from "mongoose";
import "dotenv/config";

/**
 * Employee GET route 
 * @param {start_date, end_date, dept_id?} request 
 * @returns NextReponse containing the total_sale, total_transaction, and avg_transaction, top_product
 */


// Calculate and send total_sale, total_transaction, and avg_transaction, top_product.

export async function GET(request) {
    const { start_date, end_date, dept_id, dept_name } = Object.fromEntries(request.nextUrl.searchParams);
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }

        // Match filter for date range
        const match = {};
        if (start_date && end_date) {
            match.createdAt = { $gte: new Date(start_date), $lte: new Date(end_date) };
        }

        // Join with Item collection
        const pipeline = [
            { $match: match },
            {
                $lookup: {
                    from: "Item",
                    localField: "item_id",
                    foreignField: "_id",
                    as: "item"
                }
            },
            { $unwind: "$item" }
        ];

        // Filter by department if dept_id is provided
        if (dept_id) {
            pipeline.push({ $match: { "item.dept_id": new mongoose.ObjectId(dept_id) } });
        }

        // Aggregation to calculate total_sale, total_transaction, avg_transaction, and top_product
        pipeline.push({
            $facet: {
                total_sale: [
                    {
                        $group: {
                            _id: null,
                            total_sale: { $sum: { $multiply: ["$amount_sold", "$item.cost"] } }
                        }
                    }
                ],
                total_transactions: [
                    {
                        $group: { _id: "$transaction_id" }
                    },
                    {
                        $group: { _id: null, count: { $sum: 1 } }
                    }
                ],
                top_product: [
                    {
                        $group: {
                            _id: "$item._id",
                            name: { $first: "$item.item_name" },
                            sold: { $sum: "$amount_sold" }
                        }
                    },
                    { $sort: { sold: -1 } },
                    { $limit: 1 }
                ]
            }
        });

        // Execute aggregation
        const [aggResult] = await Item_Sold.aggregate(pipeline);
        const total_sale = aggResult.total_sale[0]?.total_sale || 0;
        const total_transactions = aggResult.total_transactions[0]?.count || 0;
        const top_product = aggResult.top_product[0] || null;
        const avg_transaction = total_transactions ? Number(total_sale / total_transactions).toFixed(2) : 0;

        const response = {
            total_sale,
            total_transactions,
            top_product: top_product ? top_product.name : "N/A",
            avg_transaction,
            start_date,
            end_date,
            dept_name: dept_name || "All Departments"
        };


        return NextResponse.json(response, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
