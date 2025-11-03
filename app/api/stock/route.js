import { NextResponse } from "next/server";
import Stock from "../../../models/Stock.js";
import Department from "../../../models/Department.js";
import Item from "../../../models/Item.js";
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

        const { searchParams } = request.nextUrl
        const deptIdParam = searchParams.get("dept_id");
        const idParam = searchParams.get("id");

        if (idParam && !mongoose.Types.ObjectId.isValid(idParam)) {
            return NextResponse.json({ error: "Invalid SKU" }, { status: 500 });
        }

        const filteredDepartments = await Department.find(deptIdParam ? { _id: deptIdParam } : {}, "_id dept_name");
        const items = await Item.find(idParam ? { _id: idParam } : {}, "_id item_name cost color size type");
        const stockitems = await Stock.find(idParam ? { item_id: idParam } : {}, "item_id dept_id amount");

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

                return {
                    item_id: item ? item._id : stockEntry.item_id,
                    item_name: item?.item_name,
                    cost: item?.cost,
                    color: item?.color,
                    size: item?.size,
                    type: item?.type,
                    amount: stockEntry.amount,
                };
            });

            acc.push({
                dept_id: dept._id,
                dept_name: dept.dept_name,
                items: deptItems,
            });

            return acc;
        }, []);


        return NextResponse.json({ stock }, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
