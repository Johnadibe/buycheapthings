"use server"

import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { twoFactorTokens, users } from "../schema";
import { eq } from "drizzle-orm";
import { generateEmailVerificationToken, generateTwoFactorToken, getTwoFactorTokenByEmail, getTwoFactorTokenByToken } from "./tokens";
import { sendTwoFactorByTokenEmail, sendVerificationEmail } from "./email";
import { signIn } from "../auth";
import { AuthError } from "next-auth";
import bcrypt from "bcrypt"

const action = createSafeActionClient();

export const emailSignIn = action(LoginSchema, async ({ email, password, code }) => {
    try {
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        })

        // check if the user exist in the database
        if (existingUser?.email !== email) {
            return { error: "Email or Password Incorrect" }
        }

        if (!existingUser || typeof existingUser.password !== 'string') {
            return { error: "Email or Password Incorrect" };
        }
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatch) {
            return { error: "Email or Password Incorrect" };
        }

        // check if the user is verified
        if (!existingUser?.emailVerified) {
            if (existingUser && existingUser.email) {
                const verificationToken = await generateEmailVerificationToken(existingUser.email)
                await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token)
                return { success: "Confirmation Email Sent!" }
            }
        }

        // Two Factor
        if (existingUser && existingUser.twoFactorEnabled && existingUser.email) {
            if (code) {
                const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
                if (!twoFactorToken) {
                    return { error: "Invalid Token" }
                }
                if (twoFactorToken.token !== code) {
                    return { error: "Invalid Token" }
                }
                const hasExpired = new Date(twoFactorToken.expires) < new Date()
                if (hasExpired) {
                    return { error: "Token has expired" }
                }
                await db.delete(twoFactorTokens).where(eq(twoFactorTokens.id, twoFactorToken.id))
            } else {
                const token = await generateTwoFactorToken(existingUser.email)

                if (!token) {
                    return { error: "Token not generated!" }
                }

                await sendTwoFactorByTokenEmail(token[0].email, token[0].token)
                return { twoFactor: "Two Factor Token Sent!" }
            }
        }

        // Here, we can call the signIn method from next-auth
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/",
        })

        return { success: "User Signed In!" }
    } catch (error) {
        console.log(error)
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Email or Password Incorrect" }
                case "AccessDenied":
                    return { error: error.message }
                case "OAuthSignInError":
                    return { error: error.message }
                default:
                    return { error: "Something went wrong" }
            }
        }
        throw error
    }
})