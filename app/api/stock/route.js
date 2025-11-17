import { NextResponse } from "next/server";
import Stock from "../../../models/Stock.js";
import Department from "../../../models/Department.js";
import Item from "../../../models/Item.js";
import Item_Sold from "../../../models/Item_Sold.js";
import mongoose from "mongoose";
import "dotenv/config";


/**
 * Stock GET route 
 * @param {*} request 
 * @returns NextReponse containing object with a list of stock by department
 */

export async function GET(request) {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }

        // Search Parameters
        const { searchParams } = request.nextUrl
        const deptIdParam = searchParams.get("dept_id");
        const idParam = searchParams.get("id");

        if (idParam && !mongoose.Types.ObjectId.isValid(idParam)) {
            return NextResponse.json({ error: "Invalid SKU" }, { status: 500 });
        }

        // Fetching Data
        const filteredDepartments = await Department.find(deptIdParam ? { _id: deptIdParam } : {}, "_id dept_name");
        const items = await Item.find(idParam ? { _id: idParam } : {}, "_id item_name cost color size type");
        const stockitems = await Stock.find(idParam ? { item_id: idParam } : {}, "item_id dept_id amount");

        // Setting date range for this week
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        // Total items sold
        const soldAgg = await Item_Sold.aggregate([
            {
                $group: {
                    _id: "$item_id",
                    total_sold: { $sum: "$amount_sold" }
                }
            }
        ]);

        // Total Items sold this week
        const soldWeekAgg = await Item_Sold.aggregate([
            {
                $match: {
                    updatedAt: { $gte: startOfWeek, $lte: endOfWeek }
                }
            },
            {
                $group: {
                    _id: "$item_id",
                    sold_this_week: { $sum: "$amount_sold" }
                }
            }
        ]);

        // Mapping for total sold
        const soldMap = soldAgg.reduce((acc, cur) => {
            acc[cur._id.toString()] = cur.total_sold;
            return acc;
        }, {});

        // Mapping for sold this week
        const soldWeekMap = soldWeekAgg.reduce((acc, cur) => {
            acc[cur._id.toString()] = cur.sold_this_week;
            return acc;
        }, {});

        // Constructing stock response
        const stock = filteredDepartments.reduce((acc, dept) => {
            const deptStocks = stockitems.filter((stock) =>
                stock.dept_id.toString() === dept._id.toString()
            );

            if (deptStocks.length < 1) {
                return acc;
            }

            const deptItems = deptStocks.map((stockEntry) => {
                const item = items.find(
                    (i) => i._id.toString() === stockEntry.item_id.toString()
                );
                const sold_total = soldMap[stockEntry.item_id.toString()] || 0;
                const sold_this_week = soldWeekMap[stockEntry.item_id.toString()] || 0;
                const na = (val) => (val == null ? "N/A" : val);

                return {
                    item_id: item ? item._id : stockEntry.item_id,
                    item_name: item?.item_name,
                    cost: item?.cost,
                    color: na(item?.color),
                    size: na(item?.size),
                    type: na(item?.type),
                    amount: stockEntry.amount,
                    sold_this_week: sold_this_week,
                    sold_total: sold_total
                };
            });

            acc.push({
                dept_id: dept._id,
                dept_name: dept.dept_name,
                items: deptItems,
            });

            return acc;
        }, []);

        // Return response
        return NextResponse.json({ stock }, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
