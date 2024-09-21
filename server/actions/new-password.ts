"use server"

import { NewPasswordSchema } from "@/types/new-password-schema";
import { createSafeActionClient } from "next-safe-action";
import { getPasswordResetTokenByToken } from "./tokens";
import { db } from "..";
import { eq } from "drizzle-orm";
import { passwordResetTokens, users } from "../schema";
import bcrypt from "bcrypt"

const action = createSafeActionClient();

export const newPassword = action(NewPasswordSchema, async ({password, token}) => {
    // check the token, if they (users) dont have the token they shouldnt be allowed to change the password
    if(!token) {
        return { error: "Missing Token" }
    }

    // we need to check if the token is valid
    const existingToken = await getPasswordResetTokenByToken(token) // This functon fetch the token by the token name and returns us the token with the email
    if(!existingToken) {
        return { error: "Token not found" }
    }

    // check if the token has expired
    const hasExpired = new Date(existingToken.expires) < new Date()
    if(hasExpired) {
        return { error: "Toke has expired" }
    }

    // check existing user
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, existingToken.email)
    })

    if(!existingUser) {
        return { error: "User not found" }
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // we need to do two things here
    // we need to essentially set the new password but also delete the token from the database. The way we can do that is by using a transaction. A transaction  is a collection of either queries or posts, whether you are fetching or updating from the database
    // Lets ay you have like 3 things to do and all must go true
    await db.transaction(async (tx) => {
        await tx.update(users).set({
            password: hashedPassword
        }).where(eq(users.id, existingUser.id))
        await tx.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id))
    })
    return { success: "Password updated" }
})