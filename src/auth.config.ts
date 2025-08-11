import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"

import Credentials from "next-auth/providers/credentials";
import { registerSchema, signInSchema } from "@/lib/zod";
import { ZodError } from "zod";
import axios from "axios";
import { JWT } from "next-auth/jwt";


declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name?: string;
            username?: string;
            isEmailVerified: boolean;
            roles: string[];
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
        roles: string[];
        orgId: string;
        accessToken: string;
    }
}

async function getUserFromDb(email: string, password: string) {
    try {
        const response = await axios.post("http://localhost:5000/api/v1/auth/login", {
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

async function getUserFromDbRegister(username: string, email: string, password: string) {
    try {
        const response = await axios.post("http://localhost:5000/api/v1/auth/register", {
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
                    response = await getUserFromDb(email, password);

                    if (!response) {
                        return null;
                    }
                    const { user, tokens } = response;

                    // return JSON object with the user data
                    return {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        isEmailVerified: user.isEmailVerified,
                        roles: user.roles,
                        orgId: user.orgId,
                        accessToken: tokens.access.token, // include token for session use
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
                    response = await getUserFromDbRegister(name, email, password);

                    console.log("Response:", response);
                    if (!response) {
                        return null;
                    }
                    const { user, tokens } = response;

                    // return JSON object with the user data
                    return {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        isEmailVerified: user.isEmailVerified,
                        roles: user.roles,
                        orgId: user.orgId,
                        accessToken: tokens.access.token, // include token for session use
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
                token.accessToken = user.accessToken; // you'll manually assign this in `authorize`
            }
            return token;
        },
        redirect(params) {
            const { url, baseUrl } = params;
            // If the URL is an absolute URL, return it as is
            if (url.startsWith("http")) {
                return url;
            }
            // Otherwise, return the base URL with the path appended
            return baseUrl + url;
        },
        session({ session, token, user }) {

            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.username = token.username;
                session.user.isEmailVerified = token.isEmailVerified;
                session.user.roles = token.roles;
                session.user.orgId = token.orgId;
                session.user.accessToken = token.accessToken;
            }
            return session;
        },
    },

    secret: process.env.AUTH_SECREAT,
} satisfies NextAuthConfig