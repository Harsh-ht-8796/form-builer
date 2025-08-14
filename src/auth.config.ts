import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"

import Credentials from "next-auth/providers/credentials";
import { registerSchema, signInSchema } from "@/lib/zod";
import { ZodError } from "zod";
import axios from "axios";
import { JWT } from "next-auth/jwt";
import { RegisterResponse, User } from "./api/model";


declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name?: string;
            username?: string;
            isEmailVerified: boolean;
            roles: string[];
            profileImage: string;
            orgId: string;
            accessToken: string;
        };
    }

    interface User {
        id: string;
        email: string;
        username: string;
        isEmailVerified: boolean;
        roles: string[];
        profileImage: string;
        orgId: string;
        accessToken: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        email: string;
        username: string;
        isEmailVerified: boolean;
        profileImage: string;
        roles: string[];
        orgId: string;
        accessToken: string;
    }
}

async function getUserFromDb<LoginResponse>(email: string, password: string) {
    try {
        const response = await axios.post<LoginResponse>("http://localhost:5000/api/v1/auth/login", {
            email,
            password,
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error: any) {
        console.error("Error during API call:", error.response?.data || error.message);
        throw new Error("Failed to authenticate user.");
    }
}

async function getUserFromDbRegister<User>(username: string, email: string, password: string) {
    try {
        const response = await axios.post<User>("http://localhost:5000/api/v1/auth/register", {
            username,
            email,
            password,
            roles: ["super_admin"]
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error: any) {
        console.error("Error during API call:", error.response?.data || error.message);
        throw new Error("Failed to authenticate user.");
    }
}
export default {
    providers: [
        GitHub,
        Credentials({
            name: "Credentials",
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: {
                    value: "v7@yopmail.com",
                },
                password: {
                    value: "Test@123",
                },
            },

            authorize: async (credentials, req) => {
                try {
                    let response = null;
                    const { email, password } = await signInSchema.parseAsync(credentials);
                    console.log("Email:", email, "Password:", password);
                    // logic to salt and hash password

                    // logic to verify if the user exists
                    response = await getUserFromDb<RegisterResponse>(email, password);

                    if (!response) {
                        return null;
                    }
                    const { user, tokens } = response;

                    // return JSON object with the user data
                    return {
                        id: String(user?.id),
                        email: String(user?.email),
                        username: String(user?.username),
                        isEmailVerified: Boolean(user?.isEmailVerified),
                        roles: Array.isArray(user?.roles) ? user.roles : [],
                        orgId: String(user?.orgId),
                        profileImage: String(user?.profileImage),
                        accessToken: String(tokens?.access?.token), // include token for session use
                    };
                } catch (error) {
                    if (error instanceof ZodError) {
                        // Return `null` to indicate that the credentials are invalid
                        return null;
                    }
                    return null;
                }
            },

        }),
        Credentials({
            name: "register-credentials",
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                name: {
                    value: "v7@yopmail.com",
                },
                email: {
                    value: "v7@yopmail.com",
                },
                password: {
                    value: "Test@123",
                },
            },

            authorize: async (credentials, req) => {
                try {
                    let response = null;
                    const { name, email, password } = await registerSchema.parseAsync(credentials);
                    console.log("Name:", name, "Email:", email, "Password:", password);
                    // logic to salt and hash password

                    // logic to verify if the user exists
                    response = await getUserFromDbRegister<RegisterResponse>(name, email, password);

                    console.log("Response:", response);
                    if (!response) {
                        return null;
                    }
                    const { user, tokens } = response;
                    // user?.profileImage
                    // return JSON object with the user data
                    return {
                        id: String(user?.id),
                        email: String(user?.email),
                        username: String(user?.username),
                        isEmailVerified: Boolean(user?.isEmailVerified),
                        roles: Array.isArray(user?.roles) ? user.roles : [],
                        orgId: String(user?.orgId),
                        profileImage: String(user?.profileImage),
                        accessToken: String(tokens?.access?.token), // include token for session use
                    };
                } catch (error) {
                    if (error instanceof ZodError) {
                        // Return `null` to indicate that the credentials are invalid
                        return null;
                    }
                    return null;
                }
            },

        }),
    ],
    pages: {

        signIn: "/auth/login", // Displayed when no user is authenticated
        signOut: "/auth/logout", // Displayed when user signs out
        error: "/auth/error", // Error code passed in query string as ?error=
    },
    debug: process.env.NODE_ENV === "development",
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {

            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.username = user.username;
                token.isEmailVerified = user.isEmailVerified;
                token.roles = user.roles;
                token.orgId = user.orgId;
                token.profileImage = user.profileImage;
                token.accessToken = user.accessToken; // you'll manually assign this in `authorize`
            }
            return token;
        },
        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl)
                ? Promise.resolve(url)
                : Promise.resolve(baseUrl);
        },

        session({ session, token, user }) {

            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.username = token.username;
                session.user.isEmailVerified = token.isEmailVerified;
                session.user.profileImage = token.profileImage;
                session.user.roles = token.roles;
                session.user.orgId = token.orgId;
                session.user.accessToken = token.accessToken;
            }
            return session;
        },

    },

    secret: process.env.AUTH_SECREAT,
} satisfies NextAuthConfig