import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@lib/mongodb";
import { Resend } from "resend";
import { Provider } from "next-auth/providers";
import { render } from "@react-email/render";
import MagicLinkEmail from "./emails/MagicLinkEmail";

const resend = new Resend(process.env.RESEND_API_KEY!);

const ResendEmailProvider: Provider = {
  id: "resend",
  type: "email",
  from: process.env.RESEND_FROM_EMAIL,
  name: "Email",
  async sendVerificationRequest({ identifier, url }) {
    const emailHtml = await render(<MagicLinkEmail magicLink={url} />);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: identifier,
      subject: "Your Magic Sign-In Link",
      html: emailHtml,
    });
  },
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: "next14blog",
  }),
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
  callbacks: {
    async signIn({ user }) {
      const client = await clientPromise;
      const db = client.db("next14blog");
      const existingUser = await db.collection("users").findOne({ email: user.email });

      if (existingUser?.email === "admin@email.com") {
        await db.collection("users").updateOne(
          { email: user.email },
          { $set: { is_superuser: true } }
        );
      }

      return true;
    },

    async session({ session }) {
      const client = await clientPromise;
      const db = client.db("next14blog");
      const user = await db.collection("users").findOne({ email: session.user.email });

      if (user && session.user) {
        session.user.id = user._id.toString();
        session.user.is_superuser = user.is_superuser ?? false;
      }

      return session;
    },
  },
});
