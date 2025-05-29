"use client"
import { logout } from "@/actions/authActions"

export const SignOutButton = () => {
    return (
        <button onClick={()=> logout()}>
            Sign Out
        </button>
    )
}