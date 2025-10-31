import { NextResponse } from "next/server";
import Department from "../../../models/Department.js";
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
                resolve({
                    departments: [
                        {dept_id: 1, dept_name: "Home"}, 
                        {dept_id: 2, dept_name: "Clothing"}
                    ]
                });
            } else {
                reject("Error: Failed to fetch data."); 
            }
        }, 500); 
    });
}


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

/*export async function GET(request) {
    // TODO: this will be the GET route

    return await mock().then((res) => {
        return NextResponse.json(res, {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        })
    })
    
    
}*/
