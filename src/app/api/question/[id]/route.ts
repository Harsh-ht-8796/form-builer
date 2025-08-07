import { NextResponse } from "next/server";
import { formData } from "./data";

export const GET = async function question(id: string) {
    try {
        console.log(id);
        return NextResponse.json(formData);
    } catch (error: unknown) {
        console.log(error);
    }
};