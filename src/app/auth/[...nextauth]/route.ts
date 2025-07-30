import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/api/db/db";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
          // throw new Error("Email і пароль обов'язкові");
        }

        try {
          const client = await clientPromise;
          const db = client.db("shy-cakes");

          const user = await db
            .collection("users")
            .findOne({ email: credentials.email });
          console.log(user)

          if (!user) {
             return null;
            // throw new Error("Користувача не знайдено");
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          console.log(isValidPassword);


          if (!isValidPassword) {
            return null;
            // throw new Error("Невірний пароль");
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Помилка авторизації:", error);
          return null;
          // throw new Error("Помилка авторизації");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login"
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // session.user.id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
