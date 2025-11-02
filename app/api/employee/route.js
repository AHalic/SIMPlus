import { NextResponse } from "next/server";


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

    // return NextResponse.json(res, {
    //     status: 201,
    //     headers: { 'Content-Type': 'application/json' }
    // });
}
