"use client"
import { login } from "@/actions/authActions"

type SignInButtonProps = {
    callbackUrl?: string;
};

export const SignInButton = ({ callbackUrl }: SignInButtonProps) => {
    return (
        <button onClick={()=> login(callbackUrl)}>
            Sign in  With Google
        </button>
    )
}
