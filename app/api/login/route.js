import { NextResponse } from "next/server";
import Employee from "../../../models/Employee.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import "dotenv/config";

/**
 * Log in Route
 * @param {email, password} request 
 * @returns NextReponse containing Employee if authenticated and cookies with JWT token and role
 */

export async function POST(request) {
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
        const isMatch = await new Promise((resolve, reject) => {
            employee.comparePassword(password, (err, match) => {
                if (err) reject(err);
                else resolve(match);
            });
        });
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }
        const token = jwt.sign(
            { id: employee._id, role: employee.role, email: employee.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        const response = NextResponse.json(
            { message: "Login successful", employee },
            { status: 200 }
        );
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24
        });

        response.cookies.set("role", employee.role, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
