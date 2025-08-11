import NextAuth from "next-auth";


import authConfig from "@/auth.config";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/db";

// Function to call external login endpoint

export const { handlers, signIn, auth, signOut } = NextAuth({
    adapter: MongoDBAdapter(client),
    ...authConfig
});
