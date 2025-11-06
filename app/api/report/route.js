import { NextResponse } from "next/server";
import Employee from "../../../models/Employee.js";
import mongoose from "mongoose";
import "dotenv/config";

/**
 * Employee GET route 
 * @param {start_date, end_date, dept_id?} request 
 * @returns NextReponse containing the total_revenue, total_transactions, and avg_revenue
 */


// Calculate and send total_revenue, total_transactions, and avg_revenue.


export async function POST(request) {
    const { email, password } = await request.json();
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }
        return NextResponse.json({ message: "Login successful", employee }, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
