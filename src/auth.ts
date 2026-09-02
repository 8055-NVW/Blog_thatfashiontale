import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

async function getAuthUser(email?: string | null) {
  if (!email) {
    return null;
  }

  const client = await clientPromise;
  const db = client.db("next14blog");
  const users = db.collection("users");
  const user = await users.findOne({ email });

  if (!user) {
    return null;
  }

  const superuserEmails = process.env.SUPERUSER_EMAILS?.split(",") || [];
  const shouldBeSuper = superuserEmails.includes(user.email);

  if (user.is_superuser !== shouldBeSuper) {
    await users.updateOne(
      { _id: user._id },
      { $set: { is_superuser: shouldBeSuper } }
    );
  }

  return {
    id: user._id.toString(),
    is_superuser: shouldBeSuper,
  };
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: "next14blog",
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token }) {
      const authUser = await getAuthUser(token.email);

      if (authUser) {
        token.id = authUser.id;
        token.is_superuser = authUser.is_superuser;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.is_superuser = Boolean(token.is_superuser);
      }

      return session;
    },
  },
});
