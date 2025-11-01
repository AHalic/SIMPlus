import { NextResponse } from "next/server";
import Department from "../../../models/Department.js";
import mongoose from "mongoose";
import "dotenv/config";

/**
 * Department GET route 
 * @param {*} request 
 * @returns NextReponse containing object with a list of departments
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
        return NextResponse.json({ departments }, {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
