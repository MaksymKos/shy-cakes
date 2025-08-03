import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUserByEmail } from "@/api/db/operations";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials");
                    return null;
                }

                try {
                    console.log("Attempting to find user:", credentials.email);
                    const user = await findUserByEmail(
                        credentials.email.toLowerCase()
                    );

                    if (!user) {
                        console.log("User not found:", credentials.email);
                        return null;
                    }

                    console.log("User found, verifying password");
                    const isValidPassword = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isValidPassword) {
                        console.log(
                            "Invalid password for user:",
                            credentials.email
                        );
                        return null;
                    }

                    console.log(
                        "Authentication successful for user:",
                        credentials.email
                    );
                    return {
                        id: user._id?.toString() || "",
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        phone: user.phone,
                        shippingInfo: user.shippingInfo,
                    };
                } catch (error) {
                    console.error("Authentication error:", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 днів
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/signin",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role || "user";
                token.phone = user.phone || "";
                token.shippingInfo = user.shippingInfo;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                const user = session.user as typeof session.user & {
                    shippingInfo?: {
                        fullName: string;
                        phone: string;
                        address: string;
                        city: string;
                        postalCode: string;
                        notes: string;
                    };
                };
                user.id = token.id as string;
                user.role = token.role as string;
                user.phone = token.phone as string;
                user.shippingInfo = token.shippingInfo;
            }
            return session;
        },
    },
};
