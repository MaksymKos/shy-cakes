import { MongoClient } from "mongodb";
import NextAuth from "next-auth";

/* eslint-disable no-var */
declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}
/* eslint-enable no-var */

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: string;
      phone?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    phone?: string;
  }
}