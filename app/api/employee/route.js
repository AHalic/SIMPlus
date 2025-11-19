import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Employee from "../../../models/Employee.js";
import "dotenv/config";
import { validateEmployeeData } from "./validation";


/**
 * Employee POST route 
 * @param {*} request with data with pattern
 * @example
 * {
 *     "first_name": string,
 *     "last_name": string,
 *     "email": string,
 *     "password": string,
 *     "dept_id": string,
 *     "role": string
 * }
 * @returns NextReponse containing employee created
 */
export async function POST(request) {
    const data = await request.json()

    if (!data.first_name || !data.last_name || !data.email || !data.password || !data.dept_id || !data.role) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        );
    }
    //run backend validation (length, format, etc.)
    const { valid, errors } = validateEmployeeData(data);
    if (!valid) {
        return NextResponse.json(
            { error: "Validation failed", errors },
            { status: 400 }
        );
        }

    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }
        const employee = new Employee({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password_hash: data.password,
            dept_id: data.dept_id,
            role: data.role
        });
        await employee.save();

        return NextResponse.json(employee, {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create employee", details: error.message },
            { status: 500 }
        );
    }
}
