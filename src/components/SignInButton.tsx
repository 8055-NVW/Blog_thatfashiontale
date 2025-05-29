"use client"
import { login } from "@/actions/authActions"

export const SignInButton = () => {
    return (
        <button onClick={()=> login()}>
            Sign in  With Google
        </button>
    )
}