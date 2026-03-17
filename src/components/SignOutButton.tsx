"use client"
import { logout } from "@/actions/authActions"

type SignOutButtonProps = {
    className?: string;
};

export const SignOutButton = ({ className }: SignOutButtonProps) => {
    return (
        <button className={className} onClick={()=> logout()}>
            Sign Out
        </button>
    )
}
