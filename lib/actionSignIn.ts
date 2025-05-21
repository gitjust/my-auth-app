"use client";
import { SignInSchema } from "@/lib/zod";
import { signIn } from "next-auth/react";
import { AuthError } from "next-auth";

export const signInCredentials = async(prevState: unknown, formData: FormData) => {
    const validatedFields = SignInSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors
        }
    }
    const {email, password} = validatedFields.data;
    try {
        await signIn("credentials", {email, password, redirectTo: "/dashboard"})
    } catch (error) {
        if(error instanceof AuthError){
            switch(error.type) {
                case "CredentialsSignin":
                    return {message: "Invalid Credentials."}
                    default:
                        return {message: "Something went wrong."}
            }
        }
        throw error;
    }
}