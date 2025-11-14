import { NextResponse } from "next/server";
import Employee from "../../../../models/Employee.js";
import mongoose from "mongoose";
import "dotenv/config";
import XLSX from "xlsx";

/**
 * Employee GET route 
 * @param {start_date, end_date, dept_id?, bool{best_worst_seller, rev, forecast{day, week, month, year}, period, send_to_email}} request 
 * @returns NextReponse containing the FILE
 */

// Download and maybe email file.


export async function GET(request) {
    const { start_date, end_date, dept_id, period_slice, include_best_worst_seller, 
        top_seller, worse_seller, include_revenue, include_forecast, period_forecast, end_to_email} = await request.json();
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }
        // TODO: Write logic to generate report file based on parameters
        return NextResponse.json({ message: "Login successful", employee }, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
