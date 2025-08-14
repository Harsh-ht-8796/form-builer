"use server";


import { signIn, signOut } from "@/auth";

export const login = async () => {
    return signIn("github", {
        redirectTo: "/"
    });
}

export const logout = async () => {
    return  await signOut({
        redirect:false
    });
}

export const userCredentials = async (email: string, password: string) => {
    return signIn("Credentials", {
        email,
        password,
        redirectTo: "/dashboard",
    });
}