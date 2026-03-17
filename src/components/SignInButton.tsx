"use client"
import { login } from "@/actions/authActions"

type SignInButtonProps = {
    callbackUrl?: string;
    className?: string;
};

export const SignInButton = ({ callbackUrl, className }: SignInButtonProps) => {
    return (
        <button
            className={className ?? "rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"}
            onClick={()=> login(callbackUrl)}
        >
            Sign in with Google
        </button>
    )
}
