"use server"
import { signIn, signOut } from "@/auth";
import { sanitizeCallbackUrl } from "@/lib/authRedirect";

export const login = async (callbackUrl?: string) => {
    await signIn("google", { redirectTo: sanitizeCallbackUrl(callbackUrl) });
};

export const logout = async ()=> {
    await signOut({ redirectTo: "/"});
};
