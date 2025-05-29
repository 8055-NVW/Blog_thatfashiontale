import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@lib/mongodb";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: "next14blog",
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session }) {
      const client = await clientPromise;
      // import dbname from .env
      const db = client.db("next14blog");
      const users = db.collection("users");

      const user = await users.findOne({ email: session.user.email });
      const superuserEmails = process.env.SUPERUSER_EMAILS?.split(",") || [];

      if (user && session.user) {
        session.user.id = user._id.toString();
        const shouldBeSuper = superuserEmails.includes(user.email);

        session.user.is_superuser = shouldBeSuper;

        if (user.is_superuser !== shouldBeSuper) {
          await users.updateOne(
            { _id: user._id },
            { $set: { is_superuser: shouldBeSuper } }
          );
          //console.log(`✅ Synced DB is_superuser for ${user.email}`);
        }
      }
      return session;
    },
  },
});
