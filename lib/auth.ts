import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials) {
        console.log("email: ", credentials?.email);
        console.log("password: ", credentials?.password);
        
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password");
        }

        try {
          await connectToDatabase();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user found");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) {
            throw new Error("Invalid password");
          }

          console.log("USER: ", user);
          

          return {
            //It will be stored in session
            id: user._id.toString(),
            email: user.email,
          };
        } catch (error) {
          throw error;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({token, user}){
        if (user) {
            token._id = user.id
            token.email = user.email
        }
        return token;
    },
    async session({session, token}){
        if (session.user) {
            session.user.id = token.id as string
            session.user.email = token.email
        }
        return session;
    }
  },

  pages: {
    signIn: "/login",
    error: "/login"
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60  // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET

};
