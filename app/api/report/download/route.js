import { NextResponse } from "next/server";
import Item_Sold from "../../../../models/Item_Sold.js";
import mongoose from "mongoose";
import "dotenv/config";
import * as XLSX from "xlsx";
import nodemailer from "nodemailer";
import { cookies } from "next/headers";

/**
 * Report Download POST route
 * @param {*} request containing:
 *  start_date, end_date, dept_id, period_slice, include_best_worst_seller, include_revenue, include_forecast, period_forecast, send_to_email
 * @returns NextReponse containing a XLSX FILE
 */
export async function POST(request) {
    const { start_date, end_date, dept_id, period_slice, include_best_worst_seller, include_revenue,
        include_forecast, period_forecast, send_to_email } = await request.json();
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }
        // WORKBOOK SETUP
        const workbook = XLSX.utils.book_new();

        // Build match stage
        const matchStage = {
            updatedAt: {
                $gte: new Date(start_date),
                $lte: new Date(end_date)
            }
        };
        const revPipeline = [
            { $match: matchStage },
            {
                $lookup: {
                    from: "Item",
                    localField: "item_id",
                    foreignField: "_id",
                    as: "item"
                }
            },
            { $unwind: "$item" },
            {
                $lookup: {
                    from: "Stock",
                    localField: "item._id",
                    foreignField: "item_id",
                    as: "stock"
                }
            },
            { $unwind: "$stock" }
        ];

        // Filter by department if dept_id is provided
        revPipeline.push({
            $addFields: {
                "stock.dept_id_str": { $toString: "$stock.dept_id" }
            }
        });
        if (dept_id) {
            revPipeline.push({ $match: { "stock.dept_id_str": dept_id } });
        }

        // REVENUE
        if (include_revenue == true) {
            // Determine group format for time slice
            let groupId = {};
            if (period_slice === "Day") {
                groupId = {
                    year: { $year: "$updatedAt" },
                    month: { $month: "$updatedAt" },
                    week: { $week: "$updatedAt" },
                    day: { $dayOfMonth: "$updatedAt" }
                };
            } else if (period_slice === "Week") {
                groupId = {
                    year: { $year: "$updatedAt" },
                    month: { $month: "$updatedAt" },
                    week: { $week: "$updatedAt" }
                };
            } else if (period_slice === "Month") {
                groupId = {
                    year: { $year: "$updatedAt" },
                    month: { $month: "$updatedAt" }
                };
            } else if (period_slice === "Year") {
                groupId = {
                    year: { $year: "$updatedAt" }
                };
            } else {
                groupId = null;
            }

            // Aggregation revenue pipeline
            if (groupId) {
                revPipeline.push({
                    $group: {
                        _id: groupId,
                        total_revenue: { $sum: { $multiply: ["$amount_sold", "$sell_price"] } }
                    }
                });
            } else {
                revPipeline.push({
                    $group: {
                        _id: null,
                        total_revenue: { $sum: { $multiply: ["$amount_sold", "$sell_price"] } }
                    }
                });
            }
            revPipeline.push({ $sort: { "_id": 1 } });

            const revenue = await Item_Sold.aggregate(revPipeline);

            // Format revenue for Excel
            let revenue_sheet;
            if (groupId) {
                revenue_sheet = revenue.map(r => ({
                    ...r._id,
                    "Revenue": r.total_revenue
                }));
            } else {
                revenue_sheet = [{ total_revenue: revenue[0]?.total_revenue || 0 }];
            }
            const ws1 = XLSX.utils.json_to_sheet(revenue_sheet);
            XLSX.utils.book_append_sheet(workbook, ws1, "Revenue");
        }

        // BEST SELLER BY VALUE
        if (include_best_worst_seller == true) {
            const bestSellerValuePipeline = [
                { $match: matchStage },
                {
                    $group: {
                        _id: "$item_id",
                        total_sold_value: { $sum: { $multiply: ["$amount_sold", "$sell_price"] } },
                        total_quantity: { $sum: "$amount_sold" }
                    }
                },
                {
                    $lookup: {
                        from: "Item",
                        localField: "_id",
                        foreignField: "_id",
                        as: "item"
                    }
                },
                { $unwind: "$item" },
                { $sort: { total_sold_value: -1 } }
            ];

            const bestSellerValue = await Item_Sold.aggregate(bestSellerValuePipeline);

            // Format value for Excel sheet
            const best_seller_value_sheet = bestSellerValue.map(item => ({
                "SKU": item._id.toString(),
                "Item Name": item.item.item_name,
                "Total Value Sold": item.total_sold_value,
                "Total Quantity Sold": item.total_quantity
            }));
            const ws2 = XLSX.utils.json_to_sheet(best_seller_value_sheet);
            XLSX.utils.book_append_sheet(workbook, ws2, "Best Seller By Value");
        }

        // BEST SELLER BY QUANTITY
        if (include_best_worst_seller == true) {
            const bestSellerQuantityPipeline = [
                { $match: matchStage },
                {
                    $group: {
                        _id: "$item_id",
                        total_quantity: { $sum: "$amount_sold" },
                        total_sold_value: { $sum: { $multiply: ["$amount_sold", "$sell_price"] } }
                    }
                },
                {
                    $lookup: {
                        from: "Item",
                        localField: "_id",
                        foreignField: "_id",
                        as: "item"
                    }
                },
                { $unwind: "$item" },
                { $sort: { total_quantity: -1 } }
            ];

            const bestSellerQuantity = await Item_Sold.aggregate(bestSellerQuantityPipeline);

            // Format quantity for Excel sheet
            const best_seller_quantity_sheet = bestSellerQuantity.map(item => ({
                "SKU": item._id.toString(),
                "Item Name": item.item.item_name,
                "Total Quantity Sold": item.total_quantity,
                "Total Value Sold": item.total_sold_value
            }));
            const ws3 = XLSX.utils.json_to_sheet(best_seller_quantity_sheet);
            XLSX.utils.book_append_sheet(workbook, ws3, "Best Seller By Quantity");
        }

        // FORECAST
        if (include_forecast == true) {
            let forecast_sheet = [];

            const ws4 = XLSX.utils.json_to_sheet(forecast_sheet);
            XLSX.utils.book_append_sheet(workbook, ws4, "Forecast");
        }

        // Generate buffer
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        // Send to email if requested
        if (send_to_email) {
            const now = new Date();
            const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
            const receiver_email = cookies().get("email")?.value;

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_UN,
                    pass: process.env.EMAIL_PASS,
                },
            });

            await transporter.sendMail({
                from: process.env.EMAIL_UN,
                to: receiver_email,
                subject: "Report for" + formattedDate,
                text: "Attached is your report.",
                attachments: [
                    {
                        filename: "Report.xlsx",
                        content: buffer,
                    },
                ],
            });
        }

        // Return Excel file as response
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": "attachment; filename=\"Report.xlsx\""
            }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
