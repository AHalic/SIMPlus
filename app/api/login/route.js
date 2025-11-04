import { NextResponse } from "next/server";
import Employee from "../../../models/Employee.js";
import mongoose from "mongoose";
import "dotenv/config";

/**
 * Employee GET route 
 * @param {email, password} request 
 * @returns NextReponse containing Employee if authenticated
 */

export async function GET(request) {
    const { email, password } = await request.json();
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }
        const employee = await Employee.findOne({ email: email });
        if (!employee) {
            return NextResponse.json({ error: "Authentication failed. Employee not found." }, { status: 401 });
        }
        employee.comparePassword(password, (err, isMatch) => {
            if (err) {
                return NextResponse.json({ error: "Error comparing password" }, { status: 500 });
            }
            if (!isMatch) {
                return NextResponse.json({ error: "Invalid password" }, { status: 401 });
            }
        });
        return NextResponse.json({ message: "Login successful", employee }, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
