import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { User } from "../_lib/schemas/User";

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        useremail: { label: "Useremail", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        let user = null;
        await mongoose.connect(`${process.env.databaseURL}`);
        user = await User.findOne({
          useremail: `${credentials?.useremail as string}`,
        });

        if (user) {
          const result = await bcrypt.compare(
            credentials?.password as string,
            user.password
          );

          if (!result) {
            return null;
          }
        } else {
          return null;
        }
        return {
          id: user._id.toString(),
          name: user.username,
          email: user.useremail,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.sub || ""; // Ensure `id` exists
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      await mongoose.connect(process.env.databaseURL!);

      if (user) {
        let existingUser = await User.findOne({ useremail: user.email });

        if (!existingUser) {
          existingUser = await User.create({
            username: user.name,
            useremail: user.email,
            password: "",
          });
        }

        token.sub = existingUser._id.toString();
      }

      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
