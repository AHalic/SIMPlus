import Employee from "@/models/Employee";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

/**
 * GET route handler to fetch a single employee by ID.
 *
 * @async
 * @param {Request} request - The incoming Next.js Request object.
 * @param {string} context.params.id - The employee ID extracted from the route.
 * @returns A NextResponse containing the employee data (status 200) or an error object (status 500).
 */
export async function GET(request, context) {
    const id = (await context.params).id

    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }

        const employee = await Employee.findById(id).select('-password_hash');
        
        return NextResponse.json({employee}, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch employees", details: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request, context) {
    const id = (await context.params).id

    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }

        const body = await request.json();

        const updatedEmployee = await Employee.findByIdAndUpdate(id, body, { new: true }).select('-password_hash');

        return NextResponse.json({employee: updatedEmployee}, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update employee", details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request, context) {
    const id = (await context.params).id

    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }

        await Employee.findByIdAndDelete(id);
        
        return NextResponse.json(
            { message: "Employee deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete employee", details: error.message },
            { status: 500 }
        );
    }
}
