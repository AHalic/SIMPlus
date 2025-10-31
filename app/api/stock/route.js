import { NextResponse } from "next/server";


/** 
 * Mock promise to get data
 * */ 
const mock = async () => {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const success = true; 
    
            if (success) {
                resolve(
                    {
                        stock: [
                            // stock per department
                            {
                                dept_id: 1,
                                dept_name: "Home",
                                items: [
                                    {
                                        item_id: 1,
                                        item_name: "Frame",
                                        cost: 34,
                                        color: "pink",
                                        size: null,
                                        type: null,
                                        amount: 5, // in stock
                                        sold_this_week: 2,
                                        sold_total: 5
                                    },
                                    {
                                        item_id: 2,
                                        item_name: "Plate",
                                        cost: 14,
                                        color: "white",
                                        size: null,
                                        type: null,
                                        amount: 2, // in stock
                                        sold_this_week: 2,
                                        sold_total: 5
                                    },
                                ]
                            },
                            {
                                dept_id: 2,
                                dept_name: "Clothing",
                                items: [
                                    {
                                        item_id: 3,
                                        item_name: "T-Shirt",
                                        cost: 6,
                                        color: "black",
                                        size: "S",
                                        type: "tops",
                                        amount: 5, // in stock
                                        sold_this_week: 2,
                                        sold_total: 5
                                    },
                                ]
                            },
                        ]
                    }
                );
            } else {
                reject("Error: Failed to fetch data."); 
            }
        }, 500); 
    });
}


/**
 * Stock GET route 
 * @param {*} request 
 * @returns NextReponse containing object with a list of stock by department
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
