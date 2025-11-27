'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

 
export async function signOut() {
    const cookieStore = await cookies()
    cookieStore.delete("token")
    cookieStore.delete("email")
    cookieStore.delete("role")
    
    redirect('/login')
}

export async function getCookies() {
    const cookieStore = await cookies()
    return {
        token: cookieStore.get("token")?.value,
        email: cookieStore.get("email")?.value,
        role: cookieStore.get("role")?.value,
    }
}
