import { NextResponse } from "next/server";


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
    // TODO: this will be the GET route

    return await mock().then((res) => {
        return NextResponse.json(res, {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        })
    })
    
    
}
