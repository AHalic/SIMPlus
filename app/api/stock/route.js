import { NextResponse } from "next/server";
import Stock from "../../../models/Stock.js";
import Department from "../../../models/Department.js";
import Item from "../../../models/Item.js";
import mongoose from "mongoose";
import "dotenv/config";

/** 
 * Mock promise to get data
 * */ 
const mock = async () => {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const success = true; 
    
            if (success) {
                resolve(
                    {
                        stock: [
                            // stock per department
                            {
                                dept_id: 1,
                                dept_name: "Home",
                                items: [
                                    {
                                        item_id: 1,
                                        item_name: "Frame",
                                        cost: 34,
                                        color: "pink",
                                        size: null,
                                        type: null,
                                        amount: 5, // in stock
                                        sold_this_week: 2,
                                        sold_total: 5
                                    },
                                    {
                                        item_id: 2,
                                        item_name: "Plate",
                                        cost: 14,
                                        color: "white",
                                        size: null,
                                        type: null,
                                        amount: 2, // in stock
                                        sold_this_week: 2,
                                        sold_total: 5
                                    },
                                ]
                            },
                            {
                                dept_id: 2,
                                dept_name: "Clothing",
                                items: [
                                    {
                                        item_id: 3,
                                        item_name: "T-Shirt",
                                        cost: 6,
                                        color: "black",
                                        size: "S",
                                        type: "tops",
                                        amount: 5, // in stock
                                        sold_this_week: 2,
                                        sold_total: 5
                                    },
                                ]
                            },
                        ]
                    }
                );
            } else {
                reject("Error: Failed to fetch data."); 
            }
        }, 500); 
    });
}


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

        const departments = await Department.find({}, "_id dept_name");
        const items = await Item.find({}, "_id item_name cost color size type");
        const stockitems = await Stock.find({}, "item_id dept_id amount");

        const stock = departments.map(dept => {
            const deptStocks = stockitems.filter(stock => stock.dept_id.toString() === dept._id.toString());
            const deptItems = deptStocks.map(stockEntry => {
                const item = items.find(i => i._id.toString() === stockEntry.item_id.toString());
                return {
                    item_id: item ? item._id : stockEntry.item_id,
                    item_name: item ? item.item_name : null,
                    cost: item ? item.cost : null,
                    color: item ? item.color : null,
                    size: item ? item.size : null,
                    type: item ? item.type : null,
                    amount: stockEntry.amount
                };
            });
            return {
                dept_id: dept._id,
                dept_name: dept.dept_name,
                items: deptItems
            };
        });
        return NextResponse.json({ stock }, {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/*export async function GET(request) {
    // TODO: this will be the GET route

    return await mock().then((res) => {
        return NextResponse.json(res, {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        })
    })
    
    
}*/
