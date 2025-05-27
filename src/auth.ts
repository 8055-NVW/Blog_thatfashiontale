import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { Resend } from "resend";
import { Provider } from "next-auth/providers";

const resend = new Resend(process.env.RESEND_API_KEY!);

const ResendEmailProvider: Provider = {
    id: "resend",
    type: "email",
    // from: process.env.RESEND_FROM_EMAIL!,
    from: "onboarding@resend.dev",
    name: "Email",
    async sendVerificationRequest({ identifier, url }) {
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: identifier,
            subject: "Your Magic Sign-In Link",
            html: `<p>Click <a href="${url}">here</a> to sign in.</p>`,
        });
    },
};


export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        ResendEmailProvider,
    ],
    session: {
        strategy: "jwt",
    },
});
