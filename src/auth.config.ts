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
            refreshToken: string;
            accessTokenExpires?: number; // Made optional
        };
        error?: string; // Added error property
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
        refreshToken: string;
        accessTokenExpires?: number; // Made optional
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
        refreshToken: string;
        accessTokenExpires?: number; // Made optional
        error?: string;
    }
}

async function getUserFromDb<LoginResponse>(email: string, password: string) {
    try {
        const response = await axios.post<LoginResponse>(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/v1/auth/login", {
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
        const response = await axios.post<User>(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/v1/auth/register", {
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

async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        const response = await axios.post<{ tokens: { access: { token: string; expires: number }; refresh: { token: string; expire: number } } }>(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/refresh-tokens`,
            { refreshToken: token.refreshToken },
            { headers: { "Content-Type": "application/json" } }
        );

        const refreshedTokens = response.data;

        return {
            ...token,
            accessToken: refreshedTokens.tokens.access.token,
            accessTokenExpires: refreshedTokens.tokens.access.expires,
            refreshToken: refreshedTokens.tokens.refresh.token,
            error: undefined
        };
    } catch (error: any) {
        console.error("Error refreshing token:", error.response?.data || error.message);
        return {
            ...token,
            error: "RefreshAccessTokenError"
        };
    }
}

export default {
    providers: [
        GitHub,
        Credentials({
            name: "Credentials",
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
                    response = await getUserFromDb<RegisterResponse>(email, password);

                    if (!response) {
                        return null;
                    }
                    const { user, tokens } = response;

                    return {
                        id: String(user?.id),
                        email: String(user?.email),
                        username: String(user?.username),
                        isEmailVerified: Boolean(user?.isEmailVerified),
                        roles: Array.isArray(user?.roles) ? user.roles : [],
                        orgId: String(user?.orgId),
                        profileImage: String(user?.profileImage),
                        accessToken: String(tokens?.access?.token),
                        refreshToken: String(tokens?.refresh?.token),
                        accessTokenExpires: tokens?.access?.expires // Optional in return type
                    };
                } catch (error) {
                    if (error instanceof ZodError) {
                        return null;
                    }
                    return null;
                }
            },
        }),
        Credentials({
            name: "register-credentials",
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
                    response = await getUserFromDbRegister<RegisterResponse>(name, email, password);

                    if (!response) {
                        return null;
                    }
                    const { user, tokens } = response;

                    return {
                        id: String(user?.id),
                        email: String(user?.email),
                        username: String(user?.username),
                        isEmailVerified: Boolean(user?.isEmailVerified),
                        roles: Array.isArray(user?.roles) ? user.roles : [],
                        orgId: String(user?.orgId),
                        profileImage: String(user?.profileImage),
                        accessToken: String(tokens?.access?.token),
                        refreshToken: String(tokens?.refresh?.token),
                        accessTokenExpires: tokens?.access?.expires // Optional in return type
                    };
                } catch (error) {
                    if (error instanceof ZodError) {
                        return null;
                    }
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
        signOut: "/",
        error: "/auth/error",
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
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.accessTokenExpires = user.accessTokenExpires;
            }

            // Check if access token is expired
            const currentTime = Math.floor(Date.now() / 1000);
            if (token.accessTokenExpires && currentTime >= token.accessTokenExpires) {
                return await refreshAccessToken(token);
            }

            return token;
        },
        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl)
                ? Promise.resolve(url)
                : Promise.resolve(baseUrl);
        },
        authorized({ auth }) {
            const isAuthenticated = !!auth?.user;
            return isAuthenticated;
        },
        session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.username = token.username;
                session.user.isEmailVerified = token.isEmailVerified;
                session.user.profileImage = token.profileImage;
                session.user.roles = token.roles;
                session.user.orgId = token.orgId;
                session.user.accessToken = token.accessToken;
                session.user.refreshToken = token.refreshToken;
                session.user.accessTokenExpires = token.accessTokenExpires;

                if (token?.error) {
                    session.error = token.error;
                }
            }
            return session;
        },
    },
    secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig