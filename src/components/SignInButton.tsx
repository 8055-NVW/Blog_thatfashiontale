"use client"
import { login } from "@/actions/authActions"

type SignInButtonProps = {
    callbackUrl?: string;
    className?: string;
};

export const SignInButton = ({ callbackUrl, className }: SignInButtonProps) => {
    return (
        <button
            type="button"
            className={className ?? "inline-flex w-full items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-medium text-fg-inverse transition hover:bg-accent-hover"}
            onClick={()=> login(callbackUrl)}
        >
            Sign in with Google
        </button>
    )
}
